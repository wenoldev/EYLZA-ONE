import { useState, useEffect, useMemo } from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { useStoreStore } from '@/stores/storeStore';
import { toast } from 'sonner';
import Loader from '@/components/common/Loader';
import api from '@/lib/api';
import { Search, RotateCw, Puzzle } from 'lucide-react';

interface Plugin {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    image_url: string;
    status: string;
}

const PluginsPage = () => {
    const [plugins, setPlugins] = useState<Plugin[]>([]);
    const [activePlugins, setActivePlugins] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = useAuthStore();
    const { stores } = useStoreStore();
    const currentStore = stores?.[0];

    useEffect(() => {
        fetchData();
    }, [currentStore]);

    const fetchData = async () => {
        if (!currentStore) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            
            const [pluginsRes, activeRes] = await Promise.all([
                api.get('/api/v1/plugins'),
                api.get(`/api/v1/stores/${currentStore.id}/plugins`)
            ]);

            setPlugins(pluginsRes.data.data.plugins);
            setActivePlugins(activeRes.data.data.plugins.map((p: any) => p.slug));
        } catch (error) {
            console.error('Error fetching plugins:', error);
            toast.error('Failed to load plugins');
        } finally {
            setLoading(false);
        }
    };

    const filteredPlugins = useMemo(() => {
        return plugins.filter(plugin => 
            plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plugin.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [plugins, searchTerm]);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePurchase = async (plugin: Plugin) => {
        if (!currentStore || !user) {
            toast.error('Store or User not found');
            return;
        }

        try {
            setPurchasing(plugin.id);
            const res = await loadRazorpay();
            if (!res) {
                toast.error('Razorpay SDK failed to load. Are you online?');
                return;
            }

            // 1. Create Order
            const orderRes = await api.post('/api/v1/plugins/purchase', {
                plugin_id: plugin.id,
                store_id: currentStore.id
            });

            const orderData = orderRes.data;
            if (orderData.error) throw new Error(orderData.error.message);

            // 2. Handle Free Activation Success
            if (orderData.data?.is_free) {
                toast.success(`${plugin.name} plugin activated successfully!`);
                fetchData();
                return;
            }

            // 3. Open Razorpay for paid plugins
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY', 
                amount: orderData.data.amount,
                currency: orderData.data.currency,
                name: 'Eylza Plugins',
                description: `Purchase ${plugin.name} Plugin`,
                order_id: orderData.data.order_id,
                handler: async (response: any) => {
                    // 4. Verify Payment
                    try {
                        const verifyRes = await api.post('/api/v1/plugins/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            plugin_id: plugin.id,
                            store_id: currentStore.id
                        });

                        const verifyData = verifyRes.data;
                        if (verifyData.data?.success) {
                            toast.success(`${plugin.name} plugin activated successfully!`);
                            fetchData();
                        } else {
                            throw new Error(verifyData.error?.message || 'Verification failed');
                        }
                    } catch (err: any) {
                        toast.error(err.message || 'Payment verification failed');
                    }
                },
                prefill: {
                    name: user.user_metadata?.name || '',
                    email: user.email || '',
                },
                theme: {
                    color: '#000000',
                },
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

    if (loading && plugins.length === 0) return <Loader />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        <Puzzle className="h-10 w-10 text-primary" />
                        Plugins Store
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium">Elevate your store with powerful extensions.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                            placeholder="Find a plugin..." 
                            className="pl-10 h-12 text-lg border-2 focus-visible:ring-0 focus-visible:border-primary transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={fetchData} 
                        disabled={loading}
                        className="h-12 w-12 border-2 hover:bg-muted"
                        title="Refresh"
                    >
                        <RotateCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPlugins.length > 0 ? (
                    filteredPlugins.map((plugin) => {
                        const isActive = activePlugins.includes(plugin.slug);
                        return (
                            <Card key={plugin.id} className="group relative flex flex-col h-full overflow-hidden border-2 transition-all hover:border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1">
                                <div className="aspect-video relative bg-muted/30 overflow-hidden border-b-2">
                                    {plugin.image_url ? (
                                        <img 
                                            src={plugin.image_url} 
                                            alt={plugin.name} 
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" 
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                                            <Puzzle className="h-20 w-20 text-primary/20" strokeWidth={1} />
                                        </div>
                                    )}
                                    {isActive && (
                                        <div className="absolute top-4 right-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <Badge className="bg-black text-white px-4 py-1.5 text-sm font-bold uppercase tracking-wider shadow-md">
                                                Active
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="p-6">
                                    <div className="flex justify-between items-start gap-2 mb-3">
                                        <CardTitle className="text-2xl font-bold">{plugin.name}</CardTitle>
                                        <div className="flex flex-col items-end">
                                            <span className="font-black text-2xl tracking-tighter">
                                                {plugin.price === 0 ? "FREE" : `₹${plugin.price}`}
                                            </span>
                                        </div>
                                    </div>
                                    <CardDescription className="text-base leading-relaxed text-muted-foreground line-clamp-3">
                                        {plugin.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="mt-auto p-6 pt-0">
                                    <Button
                                        className={`w-full h-14 text-lg font-black uppercase tracking-widest transition-all ${
                                            isActive 
                                                ? "bg-muted text-muted-foreground hover:bg-muted" 
                                                : "bg-black text-white hover:bg-primary"
                                        }`}
                                        disabled={isActive || purchasing === plugin.id}
                                        onClick={() => handlePurchase(plugin)}
                                    >
                                        {purchasing === plugin.id 
                                            ? <div className="flex items-center gap-2"><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Processing</div>
                                            : isActive 
                                                ? 'Installed' 
                                                : plugin.price === 0 
                                                    ? 'Initialize' 
                                                    : 'Purchase'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })
                ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Puzzle className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold">No plugins matched your search</h3>
                        <p className="text-muted-foreground max-w-md">Try searching for something else or browse our featured extensions.</p>
                        <Button 
                            variant="link" 
                            onClick={() => setSearchTerm('')}
                            className="text-primary font-bold"
                        >
                            Clear search
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PluginsPage;
