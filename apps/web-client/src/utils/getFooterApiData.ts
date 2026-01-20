import type { FooterCompanyInfo, FooterMenus } from "@eylza/dynamic-components";
import { useStore } from "@/store/useStore";

export async function getFooterCompanyInfo(): Promise<FooterCompanyInfo> {
    const { store } = useStore.getState();

    return {
        companyInfo: {
            name: store?.name ?? undefined,
            logoUrl: store?.logo_url ?? undefined,
            description: store?.description ?? undefined,
            tagline: "",
            address: [store?.city, store?.country].filter(Boolean).join(", ") || undefined,
            phone: store?.phone ?? undefined,
            email: store?.contact_email ?? undefined,
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
    const { store, themeData } = useStore.getState();
    const storeSlug = store?.slug;

    const formatLink = (slug: string) => {
        const path = slug === 'home' ? '' : slug;
        if (!storeSlug) return `/${path}`;
        return `/${storeSlug}/${path}`;
    };

    const pages = themeData?.pages || [];

    return {
        quickLinks: pages.map((page: any) => ({
            label: page.name,
            href: formatLink(page.slug)
        })),
        policyLinks: [
            { label: "Privacy Policy", href: formatLink("policy/privacy-policy") },
            { label: "Terms & Conditions", href: formatLink("policy/terms-and-conditions") },
            { label: "Refund Policy", href: formatLink("policy/refund-policy") }
        ],
        supportLinks: [
            { label: "Contact Us", href: formatLink("contact") },
            { label: "Help Center", href: formatLink("help") }
        ]
    };
}