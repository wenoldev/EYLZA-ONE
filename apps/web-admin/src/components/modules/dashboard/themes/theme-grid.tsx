
import { useState, useEffect } from "react"
import ThemeCard from "./theme-card"
import api from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import type { Theme } from "@/types/themes"
import { useStoreStore } from "@/stores/storeStore"
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
  id: number | string
  name: string
  category: string
  preview: string
  isPaidTheme: boolean
  price: number
  isFavorite: boolean
  version: string
  added: string
}

interface ThemeGridProps {
  filter: string
  search: string
  sort: string
  onSelectTheme: (theme: ProcessedTheme) => void
}

export default function ThemeGrid({ filter, search, sort, onSelectTheme }: ThemeGridProps) {
  const { stores } = useStoreStore()
  const navigate = useNavigate()
  const [allThemes, setAllThemes] = useState<ProcessedTheme[]>([])
  const [loading, setLoading] = useState(true)
  const [installing, setInstalling] = useState<string | null>(null)


  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true)
        const response = await api.get('/api/v1/themes')
        if (response.data?.data?.themes) {

          const themesData: APITheme[] = response.data.data.themes

          const mappedThemes: ProcessedTheme[] = themesData.map((t) => ({
            id: t.id,
            name: t.name,
            category: t.global_config?.category || "General",
            preview: "/placeholder.svg", // preview_url removed from schema
            isPaidTheme: t.ispaid,
            price: t.amount ? parseFloat(t.amount) : 0,
            isFavorite: false,
            version: t.global_config?.version || "1.0.0",
            added: new Date(t.created_at).toLocaleDateString()
          }))
          setAllThemes(mappedThemes)
        }
      } catch (error) {
        console.error("Failed to fetch themes", error)
        toast.error("Failed to load themes from marketplace")
      } finally {
        setLoading(false)
      }
    }
    fetchThemes()
  }, [])

  let filtered = allThemes

  // Filter by category
  if (filter !== "All") {
    filtered = filtered.filter(
      (theme) =>
        theme.category === filter ||
        (filter === "Favorite" && theme.isFavorite === true) ||
        (filter === "Free" && !theme.isPaidTheme) ||
        (filter === "Paid" && theme.isPaidTheme),
    )
  }

  // Filter by search
  if (search) {
    filtered = filtered.filter((theme) => theme.name.toLowerCase().includes(search.toLowerCase()))
  }

  // Sort
  if (sort === "Newest") {
    // Logic for new sort if needed
    // Already sorted by API mostly, but ensures local sort
    // filtered = [...filtered].reverse() // Removing reverse as API sorts likely
    // If API sorts by created_at desc, then Newest is default. If we want explicit sort logic:
    // filtered.sort((a, b) => new Date(b.added).getTime() - new Date(a.added).getTime())
  } else if (sort === "Popular") {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name)) // Placeholder
  }

  const toggleFavorite = (id: number | string) => {
    setAllThemes((prev) =>
      prev.map(theme =>
        theme.id === id
          ? { ...theme, isFavorite: !theme.isFavorite }
          : theme
      )
    );
  }

  const handlePreview = (theme: ProcessedTheme) => {
    // Assuming demo stores follow a pattern: [theme-slug].eylza.shop
    const demoUrl = `https://${theme.name.toLowerCase().replace(/\s+/g, '-')}-demo.eylza.shop`;
    window.open(demoUrl, '_blank');
  };

  const handleSelect = async (theme: ProcessedTheme) => {
    if (!stores?.[0]?.id) {
      toast.error("Please select or create a store first");
      return;
    }

    try {
      setInstalling(theme.id.toString());
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
        // Navigate to edit theme to see it in draft
        navigate('/edit-theme');
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
              theme={theme as Theme}
              onFavoriteToggle={(e) => {
                e.stopPropagation();
                toggleFavorite(theme.id);
              }}
              onPreview={() => handlePreview(theme)}
              onSelect={() => handleSelect(theme)}
            />
            {installing === theme.id.toString() && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-20">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Installing</span>
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
