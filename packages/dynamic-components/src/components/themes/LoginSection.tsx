import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Chrome } from 'lucide-react';

interface LoginSectionProps {
    title?: string;
    subtitle?: string;
    styles?: {
        backgroundColor?: string;
    }
}

const LoginSection: React.FC<LoginSectionProps> = ({ 
    title = "Welcome Back", 
    subtitle = "Please enter your details to sign in to your account.",
    styles = {}
}) => {
    return (
        <section className="min-h-[80vh] flex items-center justify-center p-6" style={{ backgroundColor: styles.backgroundColor }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-black/5 border border-gray-100 text-center"
            >
                <div className="space-y-6 mb-12">
                    <h2 className="text-4xl font-serif tracking-tight">{title}</h2>
                    <p className="text-sm opacity-50 font-light">{subtitle}</p>
                </div>

                <div className="space-y-4 mb-10">
                    <button className="w-full flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                        <Chrome size={20} />
                        <span className="text-sm font-medium">Continue with Google</span>
                    </button>
                </div>

                <div className="relative mb-10">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-white px-4 opacity-30">Or email</span></div>
                </div>

                <form className="space-y-6 text-left">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Email Address</label>
                        <input type="email" required className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="name@company.com" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Password</label>
                            <a href="#" className="text-[10px] uppercase tracking-widest font-bold text-primary hover:underline">Forgot?</a>
                        </div>
                        <input type="password" required className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="••••••••" />
                    </div>

                    <button className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
                        <span>Sign In</span>
                        <ArrowRight size={16} />
                    </button>
                </form>

                <p className="mt-12 text-sm opacity-50 font-light">
                    Don't have an account? <a href="#" className="font-bold text-primary hover:underline">Sign up for free</a>
                </p>
            </motion.div>
        </section>
    );
};

export default LoginSection;
