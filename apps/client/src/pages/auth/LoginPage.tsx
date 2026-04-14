import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { useStore } from '@/store/useStore';
import { Mail, Lock, ArrowRight, Chrome } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useUserStore();
    const { storeId, store } = useStore();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password, store_id: storeId || '' });
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    const handleGoogleLogin = () => {
        // Placeholder for Google OAuth
        console.log("Redirecting to Google OAuth for store:", storeId);
        // window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/customer/auth/google?store_id=${storeId}`;
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-20 sm:px-6 lg:px-8 bg-accent/10">
            <div className="max-w-md w-full space-y-10 bg-card p-10 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-border/50 backdrop-blur-sm">
                <div>
                    <h2 className="text-center text-4xl font-serif font-bold italic tracking-tight mb-3">
                        Welcome back
                    </h2>
                    <p className="text-center text-sm text-muted-foreground/80 italic">
                        Log in to your <span className="text-primary font-bold not-italic">{store?.name || 'EYLZA Jewelry'}</span> account
                    </p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                                    <Mail className="h-5 w-5 text-muted-foreground/40" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 border border-border/60 rounded-2xl bg-accent/30 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/20 font-medium"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                    Password
                                </label>
                                <Link to="/forgot-password" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                                    <Lock className="h-5 w-5 text-muted-foreground/40" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 border border-border/60 rounded-2xl bg-accent/30 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/20 font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-4 px-6 rounded-2xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 font-bold transition-all shadow-xl shadow-primary/20 disabled:opacity-50 text-lg"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign in 
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </span>
                            )}
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border/60"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.3em]">
                                <span className="px-4 bg-card text-muted-foreground/50">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 py-4 border border-border rounded-2xl bg-card hover:bg-accent hover:border-primary/30 transition-all font-bold text-sm shadow-sm"
                        >
                            <Chrome className="h-5 w-5 text-primary" />
                            Sign in with Google
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-muted-foreground/60 italic">
                    New to {store?.name || 'EYLZA Jewelry'}?{' '}
                    <Link to="/register" className="not-italic font-bold text-primary hover:underline underline-offset-4">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
