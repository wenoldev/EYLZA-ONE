import { Color, BorderRadius, FontFamily } from './Common';

export interface MenuItem {
    title: string;
    link: string;
    subMenu?: MenuItem[];
    isAccent?: boolean;
    icon?: string;
}

export interface HeaderMenus {
    mainSection: MenuItem[];
    categoryBar: MenuItem[];
}

export interface HeaderActions {
    onToggleLoginDialog?: () => void;
    onToggleCart?: () => void;
    cartCount?: number;
    onToggleWishlist?: () => void;
    onSearch?: (query: string) => void;
}

export interface HeaderConfig {
    general: {
        backgroundStyle: "fill" | "border" | "none";
        borderRadiusStyle: "sharpe" | "smooth" | "full";
        textColor?: string;
        backgroundColor?: string;
        fontFamily?: FontFamily;
        logoText?: string;
        showStoreLogo?: boolean;
        storeLogo?: string;
        behaviour?: "static" | "sticky";
        borderColor?: string;
    };
    topBar?: {
        show: boolean;
        content: string;
        showIcons: boolean;
        backgroundColor?: string;
        textColor?: string;
    };
    mainBar: {
        order?: {
            id: "logo" | "search" | "icons" | "navigation" | "__gap__"
            visible: boolean
        }[]
        searchDesign?: "icon" | "input";
    };
    bottomBar: {
        show: boolean;
        alignment: "left" | "center"
    }
}

export interface HeaderProps {
    config: HeaderConfig;
    menus: HeaderMenus;
    actions?: HeaderActions;
}

export default HeaderConfig;
