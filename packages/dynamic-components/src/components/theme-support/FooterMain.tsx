import { useState, useEffect } from 'react';
import {
    Facebook, Twitter, Instagram, 
    MapPin, Mail, ChevronDown
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

    const { general, content: footerContent, mobile, sections } = config;
    const design = general.design || 'design1';
    const accentColor = general.accentColor || '#111';
    const textColor = general.textColor || '#111';
    const borderColor = general.borderColor || '#e5e7eb';
    const showAccordion = isMobile && (mobile?.layout === 'accordion' || mobile?.collapseSections);
    const textAlignment = isMobile ? (mobile?.textAlignment || 'center') : 'left';

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const renderLinks = (links: any[], linksUnderline?: boolean) => (
        <ul className={`space-y-4 pb-4 ${textAlignment === 'center' && isMobile ? 'flex flex-col items-center' : ''}`}>
            {(links || []).map(l => (
                <li key={l.href}>
                    <a 
                        href={l.href} 
                        className={`text-sm opacity-50 hover:opacity-100 transition-all inline-block underline-offset-4 ${linksUnderline ? 'hover:underline' : ''}`}
                    >
                        {l.label}
                    </a>
                </li>
            ))}
        </ul>
    );

    const renderSocialIcons = () => (
        <div className={`flex gap-4 ${textAlignment === 'center' && isMobile ? 'justify-center' : ''}`}>
            {contactInfo.socialLinks.facebook && <SocialLink href={contactInfo.socialLinks.facebook} icon={Facebook} label="Facebook" style={sections.socialIconStyle} accentColor={accentColor} />}
            {contactInfo.socialLinks.instagram && <SocialLink href={contactInfo.socialLinks.instagram} icon={Instagram} label="Instagram" style={sections.socialIconStyle} accentColor={accentColor} />}
            {contactInfo.socialLinks.twitter && <SocialLink href={contactInfo.socialLinks.twitter} icon={Twitter} label="Twitter" style={sections.socialIconStyle} accentColor={accentColor} />}
        </div>
    );

    const sectionComponents: Record<string, React.ReactNode> = {
        brand: (
            <div key="brand" className="space-y-6">
                <Brand logoUrl={contactInfo.companyInfo.logoUrl} name={contactInfo.companyInfo.name || ''} textColor={textColor} />
                <p className="text-sm opacity-60 leading-relaxed max-w-sm font-light">
                    {contactInfo.companyInfo.description || "Discover our curated collection of premium products designed for modern living."}
                </p>
            </div>
        ),
        quickLinks: (
            <div key="quickLinks" style={{ borderColor: showAccordion ? borderColor : 'transparent' }} className={`${showAccordion ? 'border-b' : ''}`}>
                <SectionHeader 
                    title="Quick Links" 
                    isMobile={isMobile} 
                    showAccordion={showAccordion}
                    isOpen={openSections['quickLinks']}
                    onToggle={() => toggleSection('quickLinks')}
                />
                <AnimatePresence>
                    {(!showAccordion || openSections['quickLinks']) && (
                        <motion.div
                            initial={showAccordion ? { height: 0, opacity: 0 } : false}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            {renderLinks(menus.quickLinks, sections.linksUnderline)}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        ),
        supportLinks: (
            <div key="supportLinks" style={{ borderColor: showAccordion ? borderColor : 'transparent' }} className={`${showAccordion ? 'border-b' : ''}`}>
                <SectionHeader 
                    title="Support" 
                    isMobile={isMobile} 
                    showAccordion={showAccordion}
                    isOpen={openSections['supportLinks']}
                    onToggle={() => toggleSection('supportLinks')}
                />
                <AnimatePresence>
                    {(!showAccordion || openSections['supportLinks']) && (
                        <motion.div
                            initial={showAccordion ? { height: 0, opacity: 0 } : false}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            {renderLinks(menus.supportLinks, sections.linksUnderline)}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        ),
        policyLinks: (
            <div key="policyLinks" style={{ borderColor: showAccordion ? borderColor : 'transparent' }} className={`${showAccordion ? 'border-b' : ''}`}>
                <SectionHeader 
                    title="Legal" 
                    isMobile={isMobile} 
                    showAccordion={showAccordion}
                    isOpen={openSections['policyLinks']}
                    onToggle={() => toggleSection('policyLinks')}
                />
                <AnimatePresence>
                    {(!showAccordion || openSections['policyLinks']) && (
                        <motion.div
                            initial={showAccordion ? { height: 0, opacity: 0 } : false}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            {renderLinks(menus.policyLinks, sections.linksUnderline)}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        ),
        social: (
            <div key="social" className="space-y-4">
                {!isMobile && <SectionHeader title="Follow Us" />}
                {renderSocialIcons()}
            </div>
        ),
        contactInfo: (
            <div key="contactInfo" style={{ borderColor: showAccordion ? borderColor : 'transparent' }} className={`${showAccordion ? 'border-b pb-4' : ''}`}>
                <SectionHeader 
                    title="Contact" 
                    isMobile={isMobile} 
                    showAccordion={showAccordion}
                    isOpen={openSections['contact']}
                    onToggle={() => toggleSection('contact')}
                />
                <AnimatePresence>
                    {(!showAccordion || openSections['contact']) && (
                        <motion.div
                            initial={showAccordion ? { height: 0, opacity: 0 } : false}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className={`space-y-3 text-sm opacity-60 font-light ${textAlignment === 'center' && isMobile ? 'flex flex-col items-center' : ''}`}>
                                <div className="flex gap-4 items-start">
                                    <MapPin size={16} className="shrink-0 mt-1" />
                                    <span className={textAlignment === 'center' && isMobile ? 'text-center' : ''}>{contactInfo.companyInfo.address}</span>
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
        )
    };

    const orderedSections = (sections.menuOrder || [
        { id: "brand", visible: true },
        { id: "quickLinks", visible: true },
        { id: "supportLinks", visible: true },
        { id: "contactInfo", visible: true },
    ]).filter(s => s.visible).map(s => ({ id: s.id, node: sectionComponents[s.id] }));

    const renderDesign1 = () => {
        const brandSection = orderedSections.find(s => s.id === 'brand');
        const socialSection = orderedSections.find(s => s.id === 'social');
        const otherSections = orderedSections.filter(s => s.id !== 'brand' && s.id !== 'social');

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-20">
                <div className="lg:col-span-4 space-y-12">
                    {brandSection?.node}
                    {socialSection?.node}
                </div>
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherSections.map(s => s.node)}
                </div>
            </div>
        );
    };

    const renderDesign2 = () => (
        <div className="flex flex-col items-center text-center space-y-12 max-w-4xl mx-auto">
            {orderedSections.map(s => (
                <div key={s.id} className="w-full">
                    {s.id === 'brand' && <Brand logoUrl={contactInfo.companyInfo.logoUrl} name={contactInfo.companyInfo.name || ''} textColor={textColor} />}
                    {(s.id === 'quickLinks' || s.id === 'supportLinks' || s.id === 'policyLinks') && (
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                            {(s.id === 'quickLinks' ? menus.quickLinks : s.id === 'supportLinks' ? menus.supportLinks : menus.policyLinks).map(l => (
                                <a key={l.href} href={l.href} className="text-sm opacity-60 hover:opacity-100 transition-opacity">{l.label}</a>
                            ))}
                        </div>
                    )}
                    {s.id === 'social' && renderSocialIcons()}
                    {s.id === 'contactInfo' && s.node}
                </div>
            ))}
        </div>
    );

    const renderDesign3 = () => (
        <div className="flex flex-col space-y-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                {orderedSections.filter(s => s.id !== 'social').map(s => (
                    <div key={s.id}>
                         {s.id === 'brand' && <Brand logoUrl={contactInfo.companyInfo.logoUrl} name={contactInfo.companyInfo.name || ''} textColor={textColor} />}
                         {(s.id === 'quickLinks' || s.id === 'supportLinks' || s.id === 'policyLinks') && (
                             <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                                 {(s.id === 'quickLinks' ? menus.quickLinks : s.id === 'supportLinks' ? menus.supportLinks : menus.policyLinks).map(l => (
                                     <a key={l.href} href={l.href} className="text-sm opacity-60 hover:opacity-100 transition-opacity">{l.label}</a>
                                 ))}
                             </div>
                         )}
                         {s.id === 'contactInfo' && (
                             <div className="text-sm opacity-60 font-light">
                                 {contactInfo.companyInfo.email}
                             </div>
                         )}
                    </div>
                ))}
            </div>
            {orderedSections.find(s => s.id === 'social') && (
                <div className="flex justify-center lg:justify-end border-t border-dashed pt-8" style={{ borderColor: `${borderColor}44` }}>
                    {renderSocialIcons()}
                </div>
            )}
        </div>
    );

    return (
        <footer
            style={{
                backgroundColor: general.backgroundColor,
                color: textColor,
                fontFamily: general.fontFamily || 'Inter',
                paddingTop: isMobile ? '3rem' : (general.paddingTop || '7rem'),
                paddingBottom: general.paddingBottom || '3rem',
                borderTop: `1px solid ${borderColor}`
            }}
            className="px-6 md:px-12 lg:px-20"
        >
            <div className="max-w-[1440px] mx-auto">
                {design === 'design1' && renderDesign1()}
                {design === 'design2' && renderDesign2()}
                {design === 'design3' && renderDesign3()}

                {/* Bottom Bar */}
                <div 
                    style={{ borderColor: borderColor }} 
                    className={`mt-12 lg:mt-20 pt-10 border-t flex flex-col ${footerContent.copyrightPosition === 'center' ? 'items-center' : 'md:flex-row justify-between items-center'} gap-6`}
                >
                    <p className={`${textAlignment === 'center' ? 'text-center' : 'text-left'} text-[10px] uppercase tracking-widest opacity-40`}>
                        {footerContent.copyrightText || `© ${new Date().getFullYear()} ${contactInfo.companyInfo.name}. All rights reserved.`}
                    </p>
                    <div className={`flex items-center gap-6 opacity-40 flex-wrap justify-center`}>
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