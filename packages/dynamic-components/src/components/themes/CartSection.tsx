import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, ArrowRight } from 'lucide-react';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string;
}

const MOCK_ITEMS: CartItem[] = [
    { id: '1', name: 'Premium Cotton Silk Saree', price: 299, quantity: 1, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e4?w=500&auto=format', variant: 'Royal Blue' },
    { id: '2', name: 'Handcrafted Designer Blouse', price: 89, quantity: 2, image: 'https://images.unsplash.com/photo-1610030469637-299f18835827?w=500&auto=format', variant: 'Gold Meena' },
];

const CartSection: React.FC = () => {
    const [items, setItems] = useState<CartItem[]>(MOCK_ITEMS);

    const updateQuantity = (id: string, delta: number) => {
        setItems(prev => prev.map(item => 
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 20;
    const total = subtotal + shipping;

    if (items.length === 0) {
        return (
            <section className="py-32 px-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 text-gray-200">
                    <ShoppingBag size={48} />
                </div>
                <h2 className="text-3xl font-serif mb-4">Your bag is empty</h2>
                <p className="text-sm opacity-50 mb-12 max-w-xs leading-relaxed">Looks like you haven't added anything to your cart yet. Let's find something special.</p>
                <a href="/shop" className="bg-primary text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px]">Start Shopping</a>
            </section>
        );
    }

    return (
        <section className="py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-20 text-center md:text-left">Shopping Bag</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Items List */}
                    <div className="lg:col-span-8 space-y-10">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div 
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-col sm:flex-row gap-8 pb-10 border-b border-gray-100 items-start md:items-center"
                                >
                                    <div className="w-full sm:w-32 aspect-[3/4] rounded-3xl overflow-hidden bg-gray-50 shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-serif tracking-tight">{item.name}</h3>
                                            <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                <X size={18} />
                                            </button>
                                        </div>
                                        {item.variant && <p className="text-xs opacity-40 uppercase tracking-widest font-bold">Variant: {item.variant}</p>}
                                        <div className="text-lg font-bold pt-2">${item.price}</div>
                                    </div>

                                    <div className="flex items-center bg-gray-50 rounded-2xl p-2 h-12">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors">
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors">
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <div className="text-lg font-bold w-24 text-right hidden sm:block">
                                        ${item.price * item.quantity}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary Card */}
                    <div className="lg:col-span-4">
                        <div className="bg-gray-50 p-10 rounded-[3rem] space-y-8 sticky top-32">
                            <h3 className="text-2xl font-serif tracking-tight italic">Order Summary</h3>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-50 font-light">Subtotal</span>
                                    <span className="font-bold">${subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-50 font-light">Estimated Shipping</span>
                                    <span className="font-bold">${shipping}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                                    <span className="text-lg font-serif">Total</span>
                                    <span className="text-3xl font-bold">${total}</span>
                                </div>
                            </div>

                            <button className="w-full bg-primary text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                                <span>Checkout Now</span>
                                <ArrowRight size={16} />
                            </button>
                            
                            <div className="pt-4 flex flex-col items-center gap-4 text-[10px] uppercase tracking-widest font-bold opacity-30">
                                <span>SECURE PAYMENTS POWERED BY RAZORPAY</span>
                                <div className="flex gap-4">
                                    <span>VISA</span>
                                    <span>MASTERCARD</span>
                                    <span>UPI</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CartSection;
