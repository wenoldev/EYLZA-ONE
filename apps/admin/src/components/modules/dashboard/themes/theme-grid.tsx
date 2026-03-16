
import { useState, useEffect, useMemo } from "react"
import ThemeCard from "./theme-card"
import api from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useStoreStore } from "@/stores/storeStore"
import { useAuthStore } from "@/stores/authStore"
import { useNavigate } from "react-router-dom"

// Define specific interfaces to avoid 'any'
interface APITheme {
  id: string
  name: string
  global_config?: {
    category?: string
    version?: string
    [key: string]: unknown
  }
  ispaid: boolean
  amount?: string
  created_at: string
}

interface ProcessedTheme {
  id: string
  name: string
  category: string
  preview: string
  isPaidTheme: boolean
  price: number
  isFavorite: boolean
  version: string
  added: string
  isPurchased?: boolean
}

interface ThemeGridProps {
  filter: string
  search: string
  sort: string
  onSelectTheme: (theme: ProcessedTheme) => void
}

export default function ThemeGrid({ filter, search, onSelectTheme }: ThemeGridProps) {
  const { stores } = useStoreStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [allThemes, setAllThemes] = useState<ProcessedTheme[]>([])
  const [purchasedIds, setPurchasedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [installing, setInstalling] = useState<string | null>(null)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    fetchThemesAndPurchases()
  }, [])

  const fetchThemesAndPurchases = async () => {
    try {
      setLoading(true)
      const [themesRes, purchasesRes] = await Promise.all([
        api.get('/api/v1/themes'),
        api.get('/api/v1/assets/purchased?type=theme')
      ])

      const themesData: APITheme[] = themesRes.data?.data?.themes || []
      const purchasesData = purchasesRes.data?.data?.purchases || []
      const purchasedThemeIds = purchasesData.map((p: any) => p.asset_id)
      
      setPurchasedIds(purchasedThemeIds)

      const mappedThemes: ProcessedTheme[] = themesData.map((t) => ({
        id: t.id,
        name: t.name,
        category: t.global_config?.category || "General",
        preview: "/placeholder.svg",
        isPaidTheme: t.ispaid,
        price: t.amount ? parseFloat(t.amount) : 0,
        isFavorite: false,
        version: t.global_config?.version || "1.0.0",
        added: new Date(t.created_at).toLocaleDateString(),
        isPurchased: purchasedThemeIds.includes(t.id)
      }))

      setAllThemes(mappedThemes)
    } catch (error) {
      console.error("Failed to fetch themes", error)
      toast.error("Failed to load themes from marketplace")
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    let result = allThemes
    if (filter !== "All") {
      result = result.filter(
        (theme) =>
          theme.category === filter ||
          (filter === "Favorite" && theme.isFavorite === true) ||
          (filter === "Free" && !theme.isPaidTheme) ||
          (filter === "Paid" && theme.isPaidTheme),
      )
    }
    if (search) {
      result = result.filter((theme) => theme.name.toLowerCase().includes(search.toLowerCase()))
    }
    return result
  }, [allThemes, filter, search])

  const toggleFavorite = (id: string) => {
    setAllThemes((prev) =>
      prev.map(theme =>
        theme.id === id
          ? { ...theme, isFavorite: !theme.isFavorite }
          : theme
      )
    );
  }

  const handlePreview = (theme: ProcessedTheme) => {
    const demoUrl = `https://${theme.name.toLowerCase().replace(/\s+/g, '-')}-demo.eylza.shop`;
    window.open(demoUrl, '_blank');
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async (theme: ProcessedTheme) => {
    if (!stores?.[0]?.id || !user) {
      toast.error('Store or User not found');
      return;
    }

    try {
      setPurchasing(theme.id);
      const res = await loadRazorpay();
      if (!res) {
        toast.error('Razorpay SDK failed to load');
        return;
      }

      const orderRes = await api.post('/api/v1/themes/purchase', {
        theme_id: theme.id,
        store_id: stores[0].id
      });

      const orderData = orderRes.data;
      if (orderData.error) throw new Error(orderData.error.message);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'Eylza Themes',
        description: `Purchase ${theme.name} Theme`,
        order_id: orderData.data.order_id,
        handler: async (response: any) => {
          try {
            const verifyRes = await api.post('/api/v1/themes/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              theme_id: theme.id,
              store_id: stores[0].id
            });

            if (verifyRes.data?.data?.success) {
              toast.success(`${theme.name} purchased successfully!`);
              fetchThemesAndPurchases();
            } else {
              throw new Error(verifyRes.data?.error?.message || 'Verification failed');
            }
          } catch (err: any) {
            toast.error(err.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user.user_metadata?.name || '',
          email: user.email || '',
        },
        theme: { color: '#000000' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error(error.message || 'Could not initiate purchase');
    } finally {
      setPurchasing(null);
    }
  };

  const handleSelect = async (theme: ProcessedTheme) => {
    if (!stores?.[0]?.id) {
      toast.error("Please select or create a store first");
      return;
    }

    if (theme.isPaidTheme && !purchasedIds.includes(theme.id)) {
      handlePurchase(theme);
      return;
    }

    try {
      setInstalling(theme.id);
      const shortId = Math.random().toString(36).substring(2, 6).toUpperCase();
      const newThemeName = `${theme.name} - ${shortId}`;

      const response = await api.post(`/api/v1/stores/${stores[0].id}/themes`, {
        theme_id: theme.id,
        name: newThemeName
      });

      if (response.data?.error) {
        toast.error(response.data.error.message || "Failed to install theme");
      } else {
        toast.success(`Theme "${newThemeName}" added to your library`);
        onSelectTheme(theme);
        navigate('/dashboard/edit-theme');
      }
    } catch (error) {
      console.error("Installation error:", error);
      toast.error("Failed to connect to marketplace");
    } finally {
      setInstalling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((theme) => (
          <div key={theme.id} className="relative group/card h-full">
            <ThemeCard
              theme={{
                ...theme,
                isPurchased: theme.isPaidTheme ? purchasedIds.includes(theme.id) : true
              } as any}
              onFavoriteToggle={(e) => {
                e.stopPropagation();
                toggleFavorite(theme.id);
              }}
              onPreview={() => handlePreview(theme)}
              onSelect={() => handleSelect(theme)}
            />
            {(installing === theme.id || purchasing === theme.id) && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-20">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {purchasing === theme.id ? "Processing" : "Installing"}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-lg">No themes found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
