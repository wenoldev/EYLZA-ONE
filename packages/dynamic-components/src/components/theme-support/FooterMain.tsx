import { useState, useEffect } from 'react';
import {
    Facebook, Twitter, Instagram, 
    MapPin, Mail, Send, ChevronDown
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { FooterConfig, FooterMenus, FooterCompanyInfo } from '../../types/Footer';
import { motion, AnimatePresence } from 'framer-motion';

/* -------------------- Types -------------------- */
interface FooterProps {
    config: FooterConfig;
    menus: FooterMenus;
    contactInfo: FooterCompanyInfo;
    viewportSize?: 'mobile' | 'tablet' | 'desktop' | string;
}

/* -------------------- Social Icon -------------------- */
const SocialLink = ({
    href,
    icon: Icon,
    label,
    style = 'circle',
    accentColor
}: {
    href: string;
    icon: LucideIcon;
    label: string;
    style?: 'circle' | 'square' | 'rounded' | 'plain';
    accentColor?: string;
}) => {
    const styles = {
        circle: 'rounded-full',
        square: '',
        rounded: 'rounded-lg',
        plain: ''
    };

    return (
        <motion.a
            whileHover={{ scale: 1.1, y: -2 }}
            href={href}
            aria-label={label}
            className={`w-10 h-10 transition-all duration-200 flex items-center justify-center ${styles[style]}`}
            style={style !== 'plain' ? { backgroundColor: `${accentColor}15`, color: accentColor } : { color: accentColor }}
        >
            <Icon size={18} />
        </motion.a>
    );
};

/* -------------------- Brand -------------------- */
const Brand = ({ logoUrl, name, textColor }: { logoUrl?: string; name: string, textColor: string }) =>
    logoUrl ? (
        <img src={logoUrl} alt={name} className="h-12 w-auto object-contain mb-2" />
    ) : (
        <span className="text-2xl sm:text-3xl font-black tracking-tighter" style={{ color: textColor }}>{name}</span>
    );

/* -------------------- Header -------------------- */
const SectionHeader = ({ title, isOpen, onToggle, isMobile, showAccordion }: { 
    title: string; 
    isOpen?: boolean; 
    onToggle?: () => void;
    isMobile?: boolean;
    showAccordion?: boolean;
}) => (
    <div 
        className={`flex items-center justify-between group cursor-pointer lg:cursor-default mb-8`}
        onClick={() => isMobile && showAccordion && onToggle?.()}
    >
        <h3 className="font-bold text-[11px] uppercase tracking-[0.2em] opacity-80">
            {title}
        </h3>
        {isMobile && showAccordion && (
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="opacity-40"
            >
                <ChevronDown size={16} />
            </motion.div>
        )}
    </div>
);

/* -------------------- Footer -------------------- */
export const FooterMain = ({ config, menus, contactInfo, viewportSize }: FooterProps) => {
    const [email, setEmail] = useState('');
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        if (viewportSize) return viewportSize === 'mobile' || viewportSize === 'tablet';
        return window.innerWidth < 1024;
    });

    useEffect(() => {
        const checkMobile = () => {
            if (viewportSize) {
                setIsMobile(viewportSize === 'mobile' || viewportSize === 'tablet');
            } else {
                setIsMobile(window.innerWidth < 1024);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [viewportSize]);

    if (!config || config?.general?.hideFooter) return null;

    const { general, content: footerContent, mobile } = config;
    const accentColor = general.accentColor || '#111';
    const textColor = general.textColor || '#111';
    const borderColor = general.borderColor || '#e5e7eb';
    const showAccordion = mobile?.layout === 'accordion' || mobile?.collapseSections;

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setEmail('');
    };

    const renderLinks = (links: any[]) => (
        <ul className="space-y-4 pb-4">
            {links.map(l => (
                <li key={l.href}>
                    <a href={l.href} className="text-sm opacity-50 hover:opacity-100 hover:translate-x-1 transition-all inline-block underline-offset-4 hover:underline">
                        {l.label}
                    </a>
                </li>
            ))}
        </ul>
    );

    return (
        <footer
            style={{
                backgroundColor: general.backgroundColor,
                color: textColor,
                fontFamily: general.fontFamily || 'Inter',
                paddingTop: isMobile ? '4rem' : '7rem',
                paddingBottom: '3rem',
                borderColor: borderColor
            }}
            className="px-6 md:px-12 lg:px-20 border-t"
        >
            <div className="max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-20">
                    
                    {/* Brand & Mission (4 Columns) */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="space-y-6">
                            <Brand logoUrl={contactInfo.companyInfo.logoUrl} name={contactInfo.companyInfo.name || ''} textColor={textColor} />
                            <p className="text-sm opacity-60 leading-relaxed max-w-sm font-light">
                                {contactInfo.companyInfo.description || "Discover our curated collection of premium products designed for modern living."}
                            </p>
                        </div>
                        
                        <div className="flex gap-4">
                            {contactInfo.socialLinks.facebook && <SocialLink href={contactInfo.socialLinks.facebook} icon={Facebook} label="Facebook" style="circle" accentColor={accentColor} />}
                            {contactInfo.socialLinks.instagram && <SocialLink href={contactInfo.socialLinks.instagram} icon={Instagram} label="Instagram" style="circle" accentColor={accentColor} />}
                            {contactInfo.socialLinks.twitter && <SocialLink href={contactInfo.socialLinks.twitter} icon={Twitter} label="Twitter" style="circle" accentColor={accentColor} />}
                        </div>
                    </div>

                    {/* Quick & Support Links (4 Columns) */}
                    <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Shop Section */}
                        <div style={{ borderColor: isMobile && showAccordion ? borderColor : 'transparent' }} className={`${isMobile && showAccordion ? 'border-b' : ''}`}>
                            <SectionHeader 
                                title="Shop" 
                                isMobile={isMobile} 
                                showAccordion={showAccordion}
                                isOpen={openSections['shop']}
                                onToggle={() => toggleSection('shop')}
                            />
                            <AnimatePresence>
                                {(!isMobile || !showAccordion || openSections['shop']) && (
                                    <motion.div
                                        initial={isMobile && showAccordion ? { height: 0, opacity: 0 } : false}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        {renderLinks(menus.quickLinks)}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Company Section */}
                        <div style={{ borderColor: isMobile && showAccordion ? borderColor : 'transparent' }} className={`${isMobile && showAccordion ? 'border-b' : ''}`}>
                            <SectionHeader 
                                title="Company" 
                                isMobile={isMobile} 
                                showAccordion={showAccordion}
                                isOpen={openSections['company']}
                                onToggle={() => toggleSection('company')}
                            />
                            <AnimatePresence>
                                {(!isMobile || !showAccordion || openSections['company']) && (
                                    <motion.div
                                        initial={isMobile && showAccordion ? { height: 0, opacity: 0 } : false}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        {renderLinks(menus.supportLinks)}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Newsletter & Contact (4 Columns) */}
                    <div className="lg:col-span-4 space-y-12">
                        <div>
                            <SectionHeader title="Newsletter" />
                            <p className="text-sm opacity-50 mb-6 font-light">Join our list and get exclusive offers and updates.</p>
                            <form onSubmit={handleSubscribe} className="relative group">
                                <input 
                                    type="email" 
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border-b py-3 pr-10 focus:outline-none transition-all font-light text-sm"
                                    style={{ borderColor: `${textColor}33` }}
                                    required
                                />
                                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>

                        <div style={{ borderColor: isMobile && showAccordion ? borderColor : 'transparent' }} className={`${isMobile && showAccordion ? 'border-b pb-4' : ''}`}>
                            <SectionHeader 
                                title="Contact" 
                                isMobile={isMobile} 
                                showAccordion={showAccordion}
                                isOpen={openSections['contact']}
                                onToggle={() => toggleSection('contact')}
                            />
                            <AnimatePresence>
                                {(!isMobile || !showAccordion || openSections['contact']) && (
                                    <motion.div
                                        initial={isMobile && showAccordion ? { height: 0, opacity: 0 } : false}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="space-y-3 text-sm opacity-60 font-light">
                                            <div className="flex gap-4 items-start">
                                                <MapPin size={16} className="shrink-0 mt-1" />
                                                <span>{contactInfo.companyInfo.address}</span>
                                            </div>
                                            <div className="flex gap-4 items-center">
                                                <Mail size={16} className="shrink-0" />
                                                <a href={`mailto:${contactInfo.companyInfo.email}`} className="hover:underline">{contactInfo.companyInfo.email}</a>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ borderColor: borderColor }} className="mt-20 pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className={`${mobile?.textAlignment === 'center' ? 'text-center md:text-left' : 'text-left'} text-[10px] uppercase tracking-widest opacity-40`}>
                        {footerContent.copyrightText || `© ${new Date().getFullYear()} ${contactInfo.companyInfo.name}. All rights reserved.`}
                    </p>
                    <div className="flex items-center gap-6 opacity-40">
                        {menus.policyLinks.map(l => (
                            <a key={l.href} href={l.href} className="text-[10px] uppercase tracking-widest hover:opacity-100 transition-opacity whitespace-nowrap">
                                {l.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterMain;