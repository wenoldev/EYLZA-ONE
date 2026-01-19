import type { HeaderConfig } from '../types/Header';

export const design1: HeaderConfig = {
    topBar: {
        show: true,
        order: 1,
        backgroundColor: "#000000",
        textColor: "#ffffff",
        height: "compact",
        alignment: "center",
        content: [{ text: "FREE SHIPPING ON ORDERS OVER $50", icon: "Package" }]
    },
    mainBar: {
        order: 2,
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        accentColor: "#ef4444",
        effectColor: "#000000",
        sticky: true,
        elementOrder: ["logo", "navigation", "icons"],
        highlight: { shape: "box", fill: "bordered", animation: "none" },
        logo: { text: "MINIMAL", size: "md", style: "text" },
        search: { design: "standard", showCategory: false, buttonStyle: "icon", placeholder: "Search...", width: "md", showCategories: false },
        navigation: { style: "dynamic", position: "left", spacing: "normal" },
        icons: {
            showUser: true,
            showCart: true,
            showWishlist: false,
            style: "outlined",
            size: "md",
            layout: "horizontal",
            cartBadge: { badgeColor: "#ef4444", badgeTextColor: "#ffffff", badgePosition: "top-right" }
        }
    },
    categoryBar: { show: false, order: 3, backgroundColor: "#ffffff", textColor: "#1f2937", hoverColor: "#000000", height: "normal", style: "simple", alignment: "center" },
    general: { style: "simple", fontFamily: "sans", borderRadius: "none", animation: true, containerWidth: "boxed" }
};

export const design2: HeaderConfig = {
    topBar: {
        show: false,
        order: 1,
        backgroundColor: "#f3f4f6",
        textColor: "#1f2937",
        height: "compact",
        alignment: "between",
        content: []
    },
    mainBar: {
        order: 2,
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        accentColor: "#3b82f6",
        effectColor: "#1f2937",
        sticky: true,
        elementOrder: ["logo", "search", "icons"],
        highlight: { shape: "rounded", fill: "text-only", animation: "none" },
        logo: { text: "STORE", size: "lg", style: "text" },
        search: { design: "dropdown", showCategory: true, buttonStyle: "icon", placeholder: "Search for products...", width: "lg", showCategories: true },
        navigation: { style: "dynamic", position: "left", spacing: "loose" },
        icons: {
            showUser: true,
            showCart: true,
            showWishlist: false,
            style: "outlined",
            size: "md",
            layout: "horizontal",
            cartBadge: { badgeColor: "#3b82f6", badgeTextColor: "#ffffff", badgePosition: "top-right" }
        }
    },
    categoryBar: { show: true, order: 3, backgroundColor: "#ffffff", textColor: "#4b5563", hoverColor: "#3b82f6", height: "normal", style: "simple", alignment: "left" },
    general: { style: "simple", fontFamily: "sans", borderRadius: "md", animation: true, containerWidth: "wide" }
};

export const design3: HeaderConfig = {
    topBar: {
        show: true,
        order: 1,
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        height: "compact",
        alignment: "center",
        content: [{ text: "NEW LIFESTYLE COLLECTION OUT NOW", icon: "Globe" }]
    },
    mainBar: {
        order: 2,
        backgroundColor: "rgba(255,255,255,0.8)",
        textColor: "#1f2937",
        accentColor: "#10b981",
        effectColor: "#1f2937",
        sticky: true,
        elementOrder: ["navigation", "logo", "icons"],
        highlight: { shape: "pill", fill: "filled", animation: "none" },
        logo: { text: "LIFESTYLE", size: "md", style: "text" },
        search: { design: "inline-bar", showCategory: false, buttonStyle: "text", placeholder: "Find your adventure...", width: "md", showCategories: false, showButton: true, buttonText: "Go" },
        navigation: { style: "dynamic", position: "left", spacing: "normal" },
        icons: {
            showUser: true,
            showCart: true,
            showWishlist: false,
            style: "filled",
            size: "md",
            layout: "horizontal",
            backgroundStyle: "circular",
            cartBadge: { badgeColor: "#000000", badgeTextColor: "#ffffff", badgePosition: "top-right" }
        }
    },
    categoryBar: { show: false, order: 3, backgroundColor: "#ffffff", textColor: "#1f2937", hoverColor: "#10b981", height: "normal", style: "simple", alignment: "center" },
    general: { style: "simple", fontFamily: "serif", borderRadius: "lg", animation: true, containerWidth: "boxed" }
};

export const design4: HeaderConfig = {
    topBar: {
        show: true,
        order: 1,
        backgroundColor: "#1e3a8a",
        textColor: "#ffffff",
        height: "compact",
        alignment: "center",
        content: [{ text: "Contact Support: 1-800-ELZA", icon: "Phone" }]
    },
    mainBar: {
        order: 2,
        backgroundColor: "#ffffff",
        textColor: "#1e3a8a",
        accentColor: "#1e3a8a",
        effectColor: "#1e3a8a",
        sticky: false,
        elementOrder: ["logo", "__gap__", "navigation", "search", "icons"],
        highlight: { shape: "underline", fill: "text-only", animation: "none" },
        logo: { text: "CORPORATE", size: "md", style: "text" },
        search: { design: "inline-bar", showCategory: false, buttonStyle: "icon", placeholder: "Search knowledge base...", width: "sm", showCategories: false },
        navigation: { style: "dynamic", position: "left", spacing: "normal" },
        icons: {
            showUser: true,
            showCart: true,
            showWishlist: false,
            style: "outlined",
            size: "sm",
            layout: "horizontal",
            cartBadge: { badgeColor: "#1e3a8a", badgeTextColor: "#ffffff", badgePosition: "top-right" }
        }
    },
    categoryBar: { show: true, order: 3, backgroundColor: "#f8fafc", textColor: "#1e3a8a", hoverColor: "#1d4ed8", height: "compact", style: "simple", alignment: "center" },
    general: { style: "simple", fontFamily: "sans", borderRadius: "sm", animation: false, containerWidth: "boxed" }
};

export const design5: HeaderConfig = {
    topBar: {
        show: false,
        order: 1,
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        height: "compact",
        alignment: "center",
        content: []
    },
    mainBar: {
        order: 2,
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        accentColor: "#3b82f6",
        effectColor: "#3b82f6",
        sticky: true,
        elementOrder: ["logo", "search", "navigation", "icons"],
        highlight: { shape: "rounded", fill: "text-only", animation: "none" },
        logo: { text: "EYLZA", size: "md", style: "text" },
        search: { design: "pill-right-icon", showCategory: false, buttonStyle: "icon", placeholder: "Search", width: "md", showCategories: false },
        navigation: { style: "dynamic", position: "left", spacing: "normal" },
        icons: {
            showUser: true,
            showCart: true,
            showWishlist: false,
            style: "outlined",
            size: "md",
            layout: "horizontal",
            backgroundStyle: "none",
            cartBadge: { badgeColor: "#3b82f6", badgeTextColor: "#ffffff", badgePosition: "top-right" }
        }
    },
    categoryBar: { show: false, order: 3, backgroundColor: "#ffffff", textColor: "#1f2937", hoverColor: "#3b82f6", height: "normal", style: "simple", alignment: "center" },
    general: { style: "simple", fontFamily: "sans", borderRadius: "999px", animation: true, containerWidth: "boxed" }
};

export const templates: Record<string, HeaderConfig> = { design1, design2, design3, design4, design5 };
