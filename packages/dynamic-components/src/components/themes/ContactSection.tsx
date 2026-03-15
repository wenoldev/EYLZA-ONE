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
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Full Name</label>
                                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Email Address</label>
                                    <input type="email" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Message</label>
                                <textarea rows={5} className="w-full bg-gray-50 border-none rounded-3xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="How can we help you?" />
                            </div>
                            <button className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                <span>Send Message</span>
                                <Send size={16} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
