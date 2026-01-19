export interface FooterLink {
    label: string;
    href: string;
}

export interface FooterMenus {
    quickLinks: FooterLink[];
    supportLinks: FooterLink[];
    policyLinks: FooterLink[];
}

export interface FooterCompanyInfo {
    companyInfo: {
        name?: string;
        logoUrl?: string;
        description?: string;
        tagline?: string;
        address?: string;
        phone?: string;
        email?: string;
    };
    socialLinks: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
        youtube?: string;
    };
}

export interface FooterConfig {
    general: {
        design: "design1" | "design2" | "design3";
        hideFooter?: boolean;
        backgroundColor: string;
        textColor: string;
        accentColor: string;
        borderColor: string;
        fontFamily?: string;
        paddingTop?: string;
        paddingBottom?: string;
    };
    sections: {
        menuOrder?: {
            id: "brand" | "quickLinks" | "supportLinks" | "policyLinks" | "social" | "contactInfo";
            visible: boolean;
        }[];
        showPaymentMethods?: boolean;
        paymentMethodsStyle?: "badges" | "icons";
        showDividers?: boolean;
        linksUnderline?: boolean;
        socialIconStyle?: "circle" | "square" | "rounded" | "plain";
    };
    mobile?: {
        textAlignment?: "left" | "center";
        stackOrder?: "desktop" | "brand-first" | "contact-first";
        layout: 'accordion' | 'row' | 'grid-2';
        collapseSections?: boolean;
        hideSocialOnMobile?: boolean;
        hidePaymentOnMobile?: boolean;
    };
    content: {
        copyrightText?: string;
        showTagline?: boolean;
        copyrightPosition?: "left" | "center" | "right";
    };
}

export interface FooterProps {
    config: FooterConfig;
    menus: FooterMenus;
    contactInfo: FooterCompanyInfo;
    viewportSize?: string;
}

export default FooterConfig;