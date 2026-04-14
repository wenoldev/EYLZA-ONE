import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { useStore } from '@/store/useStore';
import { ShieldCheck } from 'lucide-react';

const AurelianLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useUserStore();
    const { storeId, store } = useStore();
    const navigate = useNavigate();
    const { storeSlug } = useParams();
    const location = useLocation();

    const from = location.state?.from?.pathname || (storeSlug ? `/${storeSlug}` : '/');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password, store_id: storeId || '' });
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    const handleCreateAccount = () => {
        const prefix = storeSlug ? `/${storeSlug}` : "";
        navigate(`${prefix}/register`);
    };

    return (
        <main className="min-h-screen pt-32 flex items-center justify-center px-6 bg-stone-50">
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white overflow-hidden shadow-2xl rounded-[3rem] border border-stone-100">
                {/* Left Side: Branding/Image */}
                <div className="hidden md:block relative overflow-hidden group">
                    <img 
                        alt="AURUM Atelier" 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuApW-MFsw7_HCjoRB3bDkvUCUvGAkOrua8Z9EZVL6HsollyAJkP8w-fDOXYbgAJMKgEimZ4yR4vMcvTq0m2E1Z8uSTFwZw7T1rxpF2v3biL9BxpBsQOy2RjcMWWSaBM21oyrUT3A5knS8kmJf-ywILCKK30JkAL494svKEmOci1oUZLgQ5vdmnUShTsK9T4TeRRASxGA4JNZHFR440MvHwhEL0pQUsJSEm816b4Y0X3F1uB11Dt0Cr-pLIwPzemYAIdq3NlHrd3QnI"
                    />
                    <div className="absolute inset-0 bg-stone-900/10 mix-blend-multiply"></div>
                    <div className="absolute bottom-12 left-12 right-12 z-10">
                        <p className="font-serif text-3xl text-white leading-relaxed tracking-tight drop-shadow-md italic">
                            "Jewelry is the archival memory of human emotion."
                        </p>
                        <p className="mt-4 text-[10px] font-sans text-white/80 uppercase tracking-[0.4em] font-bold">Aurum Heritage Series</p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-12 md:p-20 flex flex-col justify-center bg-white backdrop-blur-xl">
                    <div className="max-w-md mx-auto w-full space-y-12">
                        <div>
                            <h2 className="text-4xl font-serif text-stone-900 mb-2 italic">Welcome Back</h2>
                            <p className="text-stone-500 font-sans text-xs tracking-widest uppercase font-bold opacity-60">
                                Enter your details to access your {store?.name || 'Atelier'} account.
                            </p>
                        </div>

                        <form className="space-y-8" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-destructive/5 text-destructive text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl border border-destructive/10 animate-in fade-in slide-in-from-top-1">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stone-400">Email Address</label>
                                <input 
                                    className="w-full bg-transparent border-0 border-b border-stone-200 py-4 px-0 focus:ring-0 focus:border-primary text-sm font-sans placeholder:text-stone-200 transition-colors outline-none" 
                                    placeholder="curator@aurum.com" 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stone-400">Password</label>
                                    <Link to="/forgot-password" size="sm" className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary hover:text-stone-900 transition-colors">
                                        Forgot?
                                    </Link>
                                </div>
                                <input 
                                    className="w-full bg-transparent border-0 border-b border-stone-200 py-4 px-0 focus:ring-0 focus:border-primary text-sm font-sans placeholder:text-stone-200 transition-colors outline-none" 
                                    placeholder="••••••••" 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="pt-6 space-y-4">
                                <button 
                                    className="w-full bg-primary text-on-primary py-6 text-[11px] font-sans font-bold uppercase tracking-[0.4em] hover:bg-stone-800 transition-all duration-300 disabled:opacity-50 shadow-xl shadow-primary/20" 
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Authenticating..." : "Sign In"}
                                </button>
                                
                                <div className="flex items-center gap-4 py-4">
                                    <div className="h-[1px] flex-1 bg-stone-100"></div>
                                    <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-300">OR</span>
                                    <div className="h-[1px] flex-1 bg-stone-100"></div>
                                </div>

                                <button 
                                    onClick={handleCreateAccount}
                                    className="w-full border border-stone-200 py-6 text-[11px] font-sans font-bold uppercase tracking-[0.4em] hover:bg-stone-50 transition-all duration-300" 
                                    type="button"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>

                        <div className="mt-16 flex items-center gap-3 opacity-40">
                            <ShieldCheck className="w-4 h-4 text-stone-400" />
                            <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-400">Secure Encrypted Session</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AurelianLogin;
