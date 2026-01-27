import type { FooterCompanyInfo, FooterMenus } from "@eylza/dynamic-components";



export async function getFooterCompanyInfo(): Promise<FooterCompanyInfo> {
    // This would typically be an API call
    return {
        companyInfo: {
            name: "EYLZA",
            description: "Your one-stop shop for modern components.",
            address: "123 Tech Street, Silicon Valley, CA",
            phone: "+1 (555) 123-4567",
            email: "hello@eylza.com",
        },
        socialLinks: {
            facebook: "https://facebook.com",
            twitter: "https://twitter.com",
            instagram: "https://instagram.com",
            linkedin: "https://linkedin.com",
            youtube: "https://youtube.com"
        },
    }
};

export async function getFooterMenus(): Promise<FooterMenus> {
    // This would typically be an API call
    return {
        quickLinks: [
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about" },
            { label: "Products", href: "/products" },
            { label: "Blog", href: "/blog" }
        ],
        policyLinks: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Cookie Policy", href: "/cookies" }
        ],
        supportLinks: [
            { label: "Help Center", href: "/help" },
            { label: "Contact Us", href: "/contact" },
            { label: "Shipping Info", href: "/shipping" },
            { label: "Returns", href: "/returns" }
        ]
    };
}