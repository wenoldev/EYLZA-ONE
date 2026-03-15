import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Box } from 'lucide-react';

const ORDERS = [
    { id: 'ORD-2024-81', date: 'Mar 12, 2024', total: 388, status: 'Processing', items: 2, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e4?w=500&auto=format' },
    { id: 'ORD-2024-12', date: 'Feb 28, 2024', total: 124, status: 'Delivered', items: 1, image: 'https://images.unsplash.com/photo-1610030469637-299f18835827?w=500&auto=format' },
];

const OrdersSection: React.FC = () => {
    return (
        <section className="py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <div className="space-y-4 mb-20 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-serif tracking-tight">Your Orders</h1>
                    <p className="text-sm opacity-50 font-light">Manage and track your recent orders and history.</p>
                </div>

                <div className="space-y-6">
                    {ORDERS.map((order, idx) => (
                        <motion.div 
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-white border border-gray-100 p-8 rounded-[2.5rem] hover:ring-[6px] hover:ring-primary/5 transition-all cursor-pointer"
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                <div className="w-24 aspect-square rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                                    <img src={order.image} alt={order.id} className="w-full h-full object-cover" />
                                </div>
                                
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <h3 className="text-lg font-bold tracking-tight">{order.id}</h3>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                            order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                        }`}>
                                            {order.status === 'Delivered' ? <CheckCircle2 size={12} className="inline mr-2" /> : <Clock size={12} className="inline mr-2" />}
                                            {order.status}
                                        </span>
                                    </div>
                                    
                                    <div className="flex gap-8 text-sm">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold opacity-30 tracking-widest mb-1">Date</p>
                                            <p className="font-medium text-gray-500">{order.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold opacity-30 tracking-widest mb-1">Items</p>
                                            <p className="font-medium text-gray-500">{order.items} items</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold opacity-30 tracking-widest mb-1">Total</p>
                                            <p className="font-bold text-black">${order.total}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto">
                                    <button className="w-full md:w-auto bg-gray-50 text-black px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {ORDERS.length === 0 && (
                    <div className="py-20 text-center space-y-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                            <Box size={32} />
                        </div>
                        <h3 className="text-xl font-serif">No orders yet</h3>
                        <p className="text-sm opacity-50 max-w-xs mx-auto">Once you've made a purchase, your orders will appear here.</p>
                        <a href="/shop" className="inline-block bg-primary text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest">Shop Now</a>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OrdersSection;
