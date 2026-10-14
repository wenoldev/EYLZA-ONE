import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactSectionProps {
    title?: string;
    subtitle?: string;
    address?: string;
    email?: string;
    phone?: string;
    styles?: {
        backgroundColor?: string;
        textColor?: string;
        accentColor?: string;
    }
}

const ContactSection: React.FC<ContactSectionProps> = ({ 
    title = "Get in Touch", 
    subtitle = "We'd love to hear from you. Our team is always here to chat.",
    address = "123 Fashion Ave, Design District, NY 10001",
    email = "hello@eylza.com",
    phone = "+1 (555) 000-0000",
    styles = {}
}) => {
    const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });
    const [submitting, setSubmitting] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError(null);

        const storeId = (globalThis as any).__EYLZA_STORE_ID__ || '';
        const apiUrl = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '') + '/api/v1';

        try {
            const res = await fetch(`${apiUrl}/public/queries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    store_id: storeId,
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error?.message || 'Failed to send message');
            }

            setSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (err: any) {
            setSubmitError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="py-24 px-6 md:px-12 lg:px-24" style={{ backgroundColor: styles.backgroundColor, color: styles.textColor }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-6xl font-serif tracking-tight"
                            >
                                {title}
                            </motion.h2>
                            <p className="text-lg opacity-60 font-light leading-relaxed max-w-md">
                                {subtitle}
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-6 items-start">
                                <div className="p-4 bg-primary/5 rounded-2xl text-primary">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase tracking-widest mb-1">Email Us</h4>
                                    <a href={`mailto:${email}`} className="text-xl opacity-60 hover:opacity-100 transition-opacity font-light">{email}</a>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="p-4 bg-primary/5 rounded-2xl text-primary">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase tracking-widest mb-1">Call Us</h4>
                                    <a href={`tel:${phone}`} className="text-xl opacity-60 hover:opacity-100 transition-opacity font-light">{phone}</a>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="p-4 bg-primary/5 rounded-2xl text-primary">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase tracking-widest mb-1">Visit Us</h4>
                                    <p className="text-xl opacity-60 font-light">{address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-black/5 border border-gray-100"
                    >
                        {submitted ? (
                            <div className="py-12 text-center space-y-3">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                    <Send size={24} />
                                </div>
                                <h3 className="text-xl font-bold font-serif italic text-gray-900">Message Received!</h3>
                                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                                    Thank you for reaching out. We will get back to you as soon as possible.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-4 text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-8" onSubmit={handleSubmit}>
                                {submitError && (
                                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">
                                        {submitError}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                                            placeholder="John Doe" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                                            placeholder="john@example.com" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Message</label>
                                    <textarea 
                                        rows={5} 
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                        className="w-full bg-gray-50 border-none rounded-3xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                                        placeholder="How can we help you?" 
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                                    <Send size={16} />
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
