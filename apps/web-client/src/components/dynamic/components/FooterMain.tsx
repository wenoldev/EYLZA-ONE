
import { useState, useEffect } from 'react';
import {
    Facebook, Twitter, Instagram, Linkedin, Youtube,
    MapPin, Phone, Mail, ChevronDown, ChevronUp
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type FooterConfig from '../types/Footer';

/* -------------------- Types -------------------- */
interface SocialLinks {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
}

interface CompanyInfo {
    name: string;
    logoUrl?: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    tagline?: string;
}

interface MenuLink {
    label: string;
    href: string;
}

interface Menus {
    quickLinks: MenuLink[];
    supportLinks: MenuLink[];
    policyLinks: MenuLink[];
}

interface ContactInfo {
    companyInfo: CompanyInfo;
    socialLinks: SocialLinks;
}

interface Section {
    id: string;
    visible: boolean;
}

interface FooterProps {
    config: FooterConfig;
    menus: Menus;
    contactInfo: ContactInfo;
    viewportSize?: 'mobile' | 'tablet';
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
        <a
            href={href}
            aria-label={label}
            className={`p-2 transition-all duration-200 hover:opacity-80 flex items-center justify-center ${styles[style]}`}
            style={style !== 'plain' ? { backgroundColor: `${accentColor}20`, color: accentColor } : { color: accentColor }}
        >
            <Icon size={18} />
        </a>
    );
};

/* -------------------- Brand -------------------- */
const Brand = ({ logoUrl, name }: { logoUrl?: string; name: string }) =>
    logoUrl ? (
        <img src={logoUrl} alt={name} className="h-10 w-auto object-contain" />
    ) : (
        <span className="text-xl sm:text-2xl font-bold">{name}</span>
    );

/* -------------------- Payments -------------------- */
const PaymentMethods = ({ borderColor, style = 'badges', isMobile }: { borderColor?: string; style?: 'badges' | 'icons'; isMobile: boolean }) => {
    const methods = [
        { name: 'Visa', icon: 'V' },
        { name: 'Mastercard', icon: 'M' },
        { name: 'PayPal', icon: 'P' },
        { name: 'Apple Pay', icon: 'A' },
        { name: 'Google Pay', icon: 'G' }
    ];

    if (style === 'icons') {
        return (
            <div className={`flex flex-wrap gap-2 sm:gap-3 justify-center ${!isMobile ? 'lg:justify-start' : ''} opacity-70`}>
                {methods.map(m => (
                    <div key={m.name} title={m.name} className="w-7 h-5 sm:w-8 border flex items-center justify-center rounded-sm text-[10px] font-bold" style={{ borderColor }}>
                        {m.icon}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={`flex flex-wrap gap-2 justify-center ${!isMobile ? 'lg:justify-start' : ''}`}>
            {methods.map(m => (
                <div
                    key={m.name}
                    className="px-2 sm:px-3 py-1 text-[10px] uppercase tracking-wider border rounded opacity-70 font-medium"
                    style={{ borderColor }}
                >
                    {m.name}
                </div>
            ))}
        </div>
    );
};

/* -------------------- Accordion -------------------- */
const CollapsibleSection = ({
    title,
    children,
    defaultOpen = false,
    borderColor,
    isMobile
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    borderColor?: string;
    isMobile: boolean;
}) => {
    const [open, setOpen] = useState(defaultOpen);
    const desktopClass = (cls: string) => !isMobile ? cls : '';

    return (
        <div className={`border-b ${desktopClass('lg:border-none')}`} style={{ borderColor: `${borderColor}40` }}>
            <button
                onClick={() => setOpen(!open)}
                className={`flex justify-between w-full py-4 ${desktopClass('lg:hidden')} items-center hover:opacity-70 transition-opacity`}
                aria-expanded={open}
            >
                <span className="font-bold text-sm uppercase tracking-wider">{title}</span>
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <div className={`${open ? 'block' : 'hidden'} ${desktopClass('lg:block')} pb-6 lg:pb-0`}>
                <h3 className={`${desktopClass('hidden lg:block')} font-bold mb-6 text-sm uppercase tracking-wider`}>{title}</h3>
                {children}
            </div>
        </div>
    );
};

/* -------------------- Footer -------------------- */
export const FooterMain = ({ config, menus, contactInfo, viewportSize }: FooterProps) => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        // Check if viewportSize prop is provided (typically in editor context)
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

    const year = new Date().getFullYear();
    const { general, sections: sectionConfig, mobile, content: footerContent } = config;
    const desktopClass = (cls: string) => !isMobile ? cls : '';

    /* ---------- Mobile layout helper ---------- */
    const getMobileLayoutClasses = () => {
        switch (mobile?.layout) {
            case 'row':
                return 'flex flex-row flex-wrap gap-6 sm:gap-8';
            case 'grid-2':
                return 'grid grid-cols-2 gap-6 sm:gap-8';
            default:
                return 'flex flex-col space-y-6';
        }
    };

    const useAccordion = isMobile && mobile?.layout === 'accordion';
    const textAlignmentClass = isMobile ? (mobile?.textAlignment === 'left' ? 'text-left' : 'text-center') : 'text-left';
    const linkClass = `text-sm opacity-70 hover:opacity-100 transition-all duration-200 ${sectionConfig.linksUnderline ? 'hover:underline' : ''}`;

    const renderSection = (id: string) => {
        const titleMap: Record<string, string> = {
            brand: 'About Us',
            quickLinks: 'Quick Links',
            supportLinks: 'Support',
            policyLinks: 'Policies',
            social: 'Follow Us',
            contactInfo: 'Contact Us'
        };

        const content: Record<string, React.ReactNode> = {
            brand: (
                <div className={`space-y-4 ${isMobile && mobile?.textAlignment === 'center' ? 'flex flex-col items-center' : ''}`}>
                    <Brand
                        logoUrl={contactInfo.companyInfo.logoUrl}
                        name={contactInfo.companyInfo.name}
                    />
                    <p className="text-sm opacity-70 leading-relaxed max-w-xs">
                        {contactInfo.companyInfo.description}
                    </p>
                </div>
            ),
            quickLinks: (
                <ul className="space-y-3">
                    {menus.quickLinks.map(l => (
                        <li key={l.href}><a href={l.href} className={linkClass}>{l.label}</a></li>
                    ))}
                </ul>
            ),
            supportLinks: (
                <ul className="space-y-3">
                    {menus.supportLinks.map(l => (
                        <li key={l.href}><a href={l.href} className={linkClass}>{l.label}</a></li>
                    ))}
                </ul>
            ),
            policyLinks: (
                <ul className="space-y-3">
                    {menus.policyLinks.map(l => (
                        <li key={l.href}><a href={l.href} className={linkClass}>{l.label}</a></li>
                    ))}
                </ul>
            ),
            social: (!isMobile || !mobile?.hideSocialOnMobile) ? (
                <div className={`flex gap-3 flex-wrap ${isMobile && mobile?.textAlignment === 'center' ? 'justify-center' : ''}`}>
                    {contactInfo.socialLinks.facebook && <SocialLink href={contactInfo.socialLinks.facebook} icon={Facebook} label="Facebook" style={sectionConfig.socialIconStyle} accentColor={general.accentColor} />}
                    {contactInfo.socialLinks.instagram && <SocialLink href={contactInfo.socialLinks.instagram} icon={Instagram} label="Instagram" style={sectionConfig.socialIconStyle} accentColor={general.accentColor} />}
                    {contactInfo.socialLinks.twitter && <SocialLink href={contactInfo.socialLinks.twitter} icon={Twitter} label="Twitter" style={sectionConfig.socialIconStyle} accentColor={general.accentColor} />}
                    {contactInfo.socialLinks.linkedin && <SocialLink href={contactInfo.socialLinks.linkedin} icon={Linkedin} label="LinkedIn" style={sectionConfig.socialIconStyle} accentColor={general.accentColor} />}
                    {contactInfo.socialLinks.youtube && <SocialLink href={contactInfo.socialLinks.youtube} icon={Youtube} label="YouTube" style={sectionConfig.socialIconStyle} accentColor={general.accentColor} />}
                </div>
            ) : null,
            contactInfo: (
                <div className={`space-y-4 text-sm ${isMobile && mobile?.textAlignment === 'center' ? 'flex flex-col items-center' : ''}`}>
                    <div className="flex gap-3 items-start opacity-70">
                        <MapPin size={18} className="shrink-0 mt-0.5" />
                        <span className="break-words">{contactInfo.companyInfo.address}</span>
                    </div>
                    <div className="flex gap-3 items-center opacity-70">
                        <Phone size={18} className="shrink-0" />
                        <a href={`tel:${contactInfo.companyInfo.phone}`} className="hover:opacity-100 transition-opacity">{contactInfo.companyInfo.phone}</a>
                    </div>
                    <div className="flex gap-3 items-center opacity-70">
                        <Mail size={18} className="shrink-0" />
                        <a href={`mailto:${contactInfo.companyInfo.email}`} className="hover:opacity-100 transition-opacity break-all">{contactInfo.companyInfo.email}</a>
                    </div>
                    {sectionConfig.showPaymentMethods && (!isMobile || !mobile?.hidePaymentOnMobile) && (
                        <div className="pt-2">
                            <PaymentMethods borderColor={general.borderColor} style={sectionConfig.paymentMethodsStyle} isMobile={isMobile} />
                        </div>
                    )}
                </div>
            )
        };

        if (useAccordion && id !== 'brand') {
            return (
                <CollapsibleSection title={titleMap[id]} borderColor={general.borderColor} isMobile={isMobile}>
                    {content[id]}
                </CollapsibleSection>
            );
        }

        return (
            <div className="space-y-6">
                {id !== 'brand' && <h3 className="font-bold text-sm uppercase tracking-wider">{titleMap[id]}</h3>}
                {content[id]}
            </div>
        );
    };

    const rawSections = sectionConfig.menuOrder?.filter(s => s.visible) ?? [];
    let displaySections = [...rawSections];

    if (isMobile) {
        if (mobile?.stackOrder === 'brand-first') {
            displaySections = [
                ...displaySections.filter(s => s.id === 'brand'),
                ...displaySections.filter(s => s.id !== 'brand')
            ];
        } else if (mobile?.stackOrder === 'contact-first') {
            displaySections = [
                ...displaySections.filter(s => s.id === 'contactInfo'),
                ...displaySections.filter(s => s.id !== 'contactInfo')
            ];
        }
    }

    const copyrightPositionClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }[footerContent.copyrightPosition || 'center'];

    const dividerStyle = sectionConfig.showDividers ? { borderRight: `1px solid ${general.borderColor}40` } : {};

    return (
        <footer
            style={{
                backgroundColor: general.backgroundColor,
                color: general.textColor,
                fontFamily: general.fontFamily || 'Inter',
                paddingTop: general.paddingTop || '3rem',
                paddingBottom: general.paddingBottom || '3rem',
            }}
            className={`px-4 ${!isMobile ? 'sm:px-6 lg:px-12' : ''}`}
        >
            <div className="max-w-7xl mx-auto">
                {/* ---------- DESIGN 1: Multi-Column Grid ---------- */}
                {general.design === 'design1' && (
                    <div className={`${getMobileLayoutClasses()} ${desktopClass('lg:grid lg:grid-cols-4 lg:gap-12')} ${textAlignmentClass}`}>
                        {displaySections.map((s, idx) => (
                            <div
                                key={s.id}
                                className={`${sectionConfig.showDividers && idx < displaySections.length - 1 && !isMobile ? 'pr-12' : ''}`}
                                style={sectionConfig.showDividers && idx < displaySections.length - 1 && !isMobile ? dividerStyle : {}}
                            >
                                {renderSection(s.id)}
                            </div>
                        ))}
                    </div>
                )}

                {/* ---------- DESIGN 2: Centered Minimal ---------- */}
                {general.design === 'design2' && (
                    <div className={`flex flex-col items-center space-y-8 sm:space-y-12 text-center`}>
                        {displaySections.map((s, idx) => (
                            <div key={s.id} className="w-full max-w-2xl">
                                {renderSection(s.id)}
                                {sectionConfig.showDividers && idx < displaySections.length - 1 && (
                                    <div className="mt-8 sm:mt-12 h-px w-full max-w-xs mx-auto opacity-20" style={{ backgroundColor: general.borderColor }} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ---------- DESIGN 3: Horizontal Compact ---------- */}
                {general.design === 'design3' && (
                    <div className={`${getMobileLayoutClasses()} ${desktopClass('lg:flex lg:flex-row lg:justify-between lg:items-start lg:gap-12')} ${textAlignmentClass}`}>
                        {displaySections.map((s, idx) => (
                            <div
                                key={s.id}
                                className={`flex-1 ${sectionConfig.showDividers && idx < displaySections.length - 1 && !isMobile ? 'pr-12' : ''}`}
                                style={sectionConfig.showDividers && idx < displaySections.length - 1 && !isMobile ? dividerStyle : {}}
                            >
                                {renderSection(s.id)}
                            </div>
                        ))}
                    </div>
                )}

                {/* ---------- Bottom Bar ---------- */}
                <div className={`mt-12 sm:mt-16 pt-6 sm:pt-8 border-t ${copyrightPositionClass}`} style={{ borderColor: `${general.borderColor}40` }}>
                    <div className="space-y-2">
                        <p className="text-xs sm:text-sm opacity-60">
                            {footerContent.copyrightText || `© ${year} ${contactInfo.companyInfo.name}. All rights reserved.`}
                        </p>
                        {footerContent.showTagline && contactInfo.companyInfo.tagline && (
                            <p className="text-xs opacity-40 italic">
                                {contactInfo.companyInfo.tagline}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};