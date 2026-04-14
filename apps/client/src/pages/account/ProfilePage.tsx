import React, { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { User, Mail, Phone, Camera, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const { user, updateProfile, isLoading } = useUserStore();
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile({ name, phone });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to update profile:', err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Return to Store
            </Link>

            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
                <div className="h-32 bg-primary/10 border-b border-border mb-16 relative">
                    <div className="absolute -bottom-12 left-8 group">
                        <div className="w-24 h-24 rounded-2xl bg-card border-4 border-card shadow-lg overflow-hidden relative">
                            <img 
                                src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                                alt={user?.name || 'User'} 
                                className="w-full h-full object-cover"
                            />
                            <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                <Camera className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-8 pb-8">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h1 className="text-3xl font-serif font-bold italic tracking-tight mb-1">{user?.name || 'Valued Customer'}</h1>
                            <p className="text-muted-foreground">Manage your personal information and account settings.</p>
                        </div>
                        <div className="bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">
                                {user?.status || 'Active'} Account
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-accent/30 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/30 font-medium"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                                    <input 
                                        type="email" 
                                        value={user?.email}
                                        disabled
                                        className="w-full pl-12 pr-4 py-3 bg-accent/10 border border-border rounded-xl text-muted-foreground cursor-not-allowed font-medium"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground italic ml-1">* Email cannot be changed for security</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                    <input 
                                        type="tel" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-accent/30 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/30 font-medium"
                                        placeholder="+91 00000 00000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-border flex items-center justify-between">
                            <p className="text-xs text-muted-foreground italic max-w-xs">
                                Updates might take a few moments to reflect across all services.
                            </p>
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {isLoading ? 'Saving Changes...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>

                    {success && (
                        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-sm font-bold animate-in fade-in zoom-in-95 text-center">
                            Profile updated successfully!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
