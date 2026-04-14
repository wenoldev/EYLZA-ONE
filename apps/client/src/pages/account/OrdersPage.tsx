import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { Package, Truck, CheckCircle2, ShoppingBag, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrdersPage: React.FC = () => {
    const { user } = useUserStore();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock fetching orders
        setIsLoading(true);
        setTimeout(() => {
            const mockOrders = [
                { 
                    id: '#EYL-12345', 
                    date: 'March 15, 2026', 
                    total: 7999, 
                    status: 'Delivered', 
                    items: [
                        { name: 'Gold Birthstone Necklace', image: '/images/jewelry-1.jpg', price: 4999, quantity: 1 },
                        { name: 'Silver Hoop Earrings', image: '/images/jewelry-2.jpg', price: 2999, quantity: 1 }
                    ]
                },
                { 
                    id: '#EYL-12301', 
                    date: 'February 28, 2026', 
                    total: 12499, 
                    status: 'Shipped', 
                    items: [
                        { name: 'Diamond Solitaire Ring', image: '/images/jewelry-3.jpg', price: 12499, quantity: 1 }
                    ]
                }
            ];
            setOrders(mockOrders);
            setIsLoading(false);
        }, 1200);
    }, [user?.id]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Delivered': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'Shipped': return <Truck className="w-4 h-4 text-primary" />;
            default: return <Package className="w-4 h-4 text-amber-500" />;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Delivered': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'Shipped': return 'bg-primary/10 text-primary border-primary/20';
            default: return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold italic tracking-tight mb-3">Order History</h1>
                    <p className="text-muted-foreground">Track your orders and view past purchases from {user?.name || 'your'} collection.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-accent/30 hover:bg-accent/50 border border-border rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refresh
                    </button>
                    <Link to="/products" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                        New Order
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-8">
                    {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse bg-accent/20 h-64 rounded-3xl border border-border" />
                    ))}
                </div>
            ) : orders.length > 0 ? (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl hover:border-primary/30 transition-all group">
                            {/* Order Header */}
                            <div className="px-8 py-6 bg-accent/10 border-b border-border flex flex-wrap items-center justify-between gap-6">
                                <div className="flex items-center gap-8">
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Order Placed</p>
                                        <p className="text-sm font-bold italic">{order.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="text-sm font-bold italic">₹ {order.total.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Order ID</p>
                                        <p className="text-sm font-bold font-mono tracking-tighter">{order.id}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="p-8">
                                <div className="space-y-6">
                                    {order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <div className="w-20 h-24 rounded-2xl bg-accent overflow-hidden border border-border/50">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold italic mb-1">{item.name}</h4>
                                                <p className="text-xs text-muted-foreground mb-2">Quantity: {item.quantity}</p>
                                                <p className="text-sm font-bold font-serif opacity-80 italic">₹ {item.price.toLocaleString()}</p>
                                            </div>
                                            <button className="text-xs font-bold text-primary hover:underline underline-offset-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                View Product
                                                <ExternalLink className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 pt-8 border-t border-border flex justify-between items-center">
                                    <div className="flex gap-4">
                                        <button className="text-xs font-bold hover:text-primary transition-colors flex items-center gap-2 p-2 px-4 border border-border rounded-xl">
                                            Download Invoice
                                        </button>
                                        <button className="text-xs font-bold hover:text-primary transition-colors flex items-center gap-2 p-2 px-4 border border-border rounded-xl">
                                            Need Help?
                                        </button>
                                    </div>
                                    <button className="flex items-center gap-2 group/btn text-sm font-bold text-primary italic">
                                        Track Shipment
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-accent/10 rounded-3xl border border-dashed border-border flex flex-col items-center">
                    <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold mb-3 italic">No orders found</h2>
                    <p className="text-muted-foreground mb-10 max-w-xs mx-auto">You haven't placed any orders yet. Explore our collection and find something beautiful.</p>
                    <Link
                        to="/products"
                        className="bg-primary text-white px-10 py-3.5 rounded-full font-bold hover:shadow-xl transition-all"
                    >
                        Start Shopping
                    </Link>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
