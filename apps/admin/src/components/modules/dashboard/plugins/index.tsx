import { useState, useEffect } from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { useStoreStore } from '@/stores/storeStore';
import { toast } from 'sonner';
import Loader from '@/components/common/Loader';

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

    const { user } = useAuthStore();
    const { stores } = useStoreStore();
    const currentStore = stores?.[0]; // Assuming first store for now

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

    useEffect(() => {
        fetchData();
    }, [currentStore]);

    const fetchData = async () => {
        if (!currentStore) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('auth_token'); // Adjust based on how token is stored

            const [pluginsRes, activeRes] = await Promise.all([
                fetch(`${API_URL}/plugins`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_URL}/stores/${currentStore.id}/plugins`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const pluginsData = await pluginsRes.json();
            const activeData = await activeRes.json();

            if (pluginsData.data?.plugins) setPlugins(pluginsData.data.plugins);
            if (activeData.data?.plugins) {
                setActivePlugins(activeData.data.plugins.map((p: any) => p.slug));
            }
        } catch (error) {
            console.error('Error fetching plugins:', error);
            toast.error('Failed to load plugins');
        } finally {
            setLoading(false);
        }
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

            const token = localStorage.getItem('auth_token');

            // 1. Create Order
            const orderRes = await fetch(`${API_URL}/plugins/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    plugin_id: plugin.id,
                    store_id: currentStore.id
                })
            });

            const orderData = await orderRes.json();
            if (orderData.error) throw new Error(orderData.error.message);

            // 2. Open Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_YOUR_KEY', // Should be in env
                amount: orderData.data.amount,
                currency: orderData.data.currency,
                name: 'Eylza Plugins',
                description: `Purchase ${plugin.name} Plugin`,
                order_id: orderData.data.order_id,
                handler: async (response: any) => {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch(`${API_URL}/plugins/verify`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                plugin_id: plugin.id,
                                store_id: currentStore.id
                            })
                        });

                        const verifyData = await verifyRes.json();
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
                    color: '#3e89ff',
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

    if (loading) return <Loader />;

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Plugins Store</h1>
                <p className="text-muted-foreground">Enhance your store with powerful features.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plugins.map((plugin) => {
                    const isActive = activePlugins.includes(plugin.slug);
                    return (
                        <Card key={plugin.id} className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg border-muted">
                            <div className="aspect-video relative bg-muted flex items-center justify-center p-6">
                                {plugin.image_url ? (
                                    <img src={plugin.image_url} alt={plugin.name} className="object-contain w-full h-full" />
                                ) : (
                                    <div className="text-4xl">🧩</div>
                                )}
                                {isActive && (
                                    <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">Active</Badge>
                                )}
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>{plugin.name}</CardTitle>
                                    <span className="font-bold text-lg">₹{plugin.price}</span>
                                </div>
                                <CardDescription className="line-clamp-2">{plugin.description}</CardDescription>
                            </CardHeader>
                            <CardFooter className="mt-auto border-t p-4 bg-muted/30">
                                <Button
                                    className="w-full"
                                    variant={isActive ? "outline" : "default"}
                                    disabled={isActive || purchasing === plugin.id}
                                    onClick={() => handlePurchase(plugin)}
                                >
                                    {purchasing === plugin.id ? 'Processing...' : isActive ? 'Installed' : 'Install Plugin'}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default PluginsPage;
