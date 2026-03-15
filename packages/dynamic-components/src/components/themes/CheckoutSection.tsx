import React from 'react';
import { Truck, CreditCard, CheckCircle2 } from 'lucide-react';

const CheckoutSection: React.FC = () => {
    return (
        <section className="py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-7 space-y-16">
                        <div className="space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</div>
                                <h2 className="text-2xl font-serif tracking-tight">Shipping Information</h2>
                            </div>
                            
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">First Name</label>
                                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Last Name</label>
                                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Doe" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Shipping Address</label>
                                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Street name and number" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">City</label>
                                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="New York" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Postal Code</label>
                                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="10001" />
                                </div>
                            </form>
                        </div>

                        <div className="space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</div>
                                <h2 className="text-2xl font-serif tracking-tight">Shipping Method</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="relative p-6 border-2 border-primary bg-primary/5 rounded-[2rem] cursor-pointer group">
                                    <input type="radio" name="shipping" defaultChecked className="hidden" />
                                    <div className="flex justify-between items-start mb-4">
                                        <Truck size={20} className="text-primary" />
                                        <CheckCircle2 size={18} className="text-primary" />
                                    </div>
                                    <h4 className="font-bold text-sm tracking-widest uppercase mb-1">Standard Delivery</h4>
                                    <p className="text-xs opacity-50 mb-4 whitespace-nowrap">Deliver in 3-5 business days</p>
                                    <span className="text-lg font-bold">Free</span>
                                </label>
                                <label className="relative p-6 border border-gray-100 bg-white rounded-[2rem] cursor-pointer hover:border-gray-300 transition-colors group">
                                    <input type="radio" name="shipping" className="hidden" />
                                    <div className="flex justify-between items-start mb-4">
                                        <Truck size={20} className="text-gray-300" />
                                    </div>
                                    <h4 className="font-bold text-sm tracking-widest uppercase mb-1">Express Delivery</h4>
                                    <p className="text-xs opacity-50 mb-4 whitespace-nowrap">Deliver in 1-2 business days</p>
                                    <span className="text-lg font-bold">$15.00</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-gray-50 p-10 rounded-[3rem] space-y-10 sticky top-32">
                            <h3 className="text-2xl font-serif tracking-tight">Summary</h3>
                            
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-16 aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
                                        <img src="https://images.unsplash.com/photo-1583391733956-6c78276477e4?w=500&auto=format" alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium">Cotton Silk Saree</h4>
                                        <p className="text-[10px] uppercase font-bold opacity-30 tracking-widest">Qty: 1</p>
                                        <p className="text-sm font-bold mt-1">$299</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-200 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-40 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                    <span className="font-bold">$299</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-40 font-bold uppercase tracking-widest text-[10px]">Shipping</span>
                                    <span className="font-bold">Free</span>
                                </div>
                                <div className="pt-4 flex justify-between items-end border-t border-gray-200">
                                    <span className="text-lg font-serif italic">Total to pay</span>
                                    <span className="text-3xl font-bold">$299</span>
                                </div>
                            </div>

                            <button className="w-full bg-black text-white py-6 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gray-900 transition-all shadow-xl shadow-black/10">
                                <CreditCard size={18} />
                                <span>Place Order</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CheckoutSection;
