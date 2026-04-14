import type { HeaderConfig } from '../types/Header';

export const design1: HeaderConfig = {
    general: {
        backgroundStyle: "fill",
        borderRadiusStyle: "smooth",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        fontFamily: "Inter",
        logoText: "ZARISHKA",
        showStoreLogo: false,
        storeLogo: "",
        behaviour: "sticky"
    },
    topBar: {
        show: true,
        content: "Free shipping on orders over $50",
        showIcons: true,
        backgroundColor: "#4a5d4e",
        textColor: "#ffffff"
    },
    mainBar: {
        order: [
            { id: "navigation", visible: true },
            { id: "__gap__", visible: true },
            { id: "logo", visible: true },
            { id: "__gap__", visible: true },
            { id: "search", visible: true },
            { id: "icons", visible: true }
        ],
        searchDesign: "icon"
    },
    bottomBar: {
        show: false,
        alignment: "center"
    }
};

export const design2: HeaderConfig = {
    general: {
        backgroundStyle: "none",
        borderRadiusStyle: "sharpe",
        backgroundColor: "transparent",
        textColor: "#ffffff",
        fontFamily: "serif",
        logoText: "MINIMAL",
        showStoreLogo: false,
        storeLogo: "",
        behaviour: "static"
    },
    topBar: {
        show: false,
        content: "",
        showIcons: false
    },
    mainBar: {
        order: [
            { id: "logo", visible: true },
            { id: "__gap__", visible: true },
            { id: "navigation", visible: true },
            { id: "__gap__", visible: true },
            { id: "icons", visible: true }
        ],
        searchDesign: "input"
    },
    bottomBar: {
        show: false,
        alignment: "left"
    }
};

export const templates: Record<string, HeaderConfig> = { design1, design2 };
