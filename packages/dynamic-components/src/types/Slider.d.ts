import { DynamicCardProps } from "../components/common/DynamicCard";

export interface SliderConfig {
    title?: string;
    subtitle?: string;
    viewAllLabel?: string;
    viewAllLink?: string;
    items: any[];
    template: 'category' | 'product' | 'minimal';
    infinite?: boolean;
    autoPlay?: boolean;
    interval?: number;
    itemsPerView: {
        desktop: number;
        tablet: number;
        mobile: number;
    };
    styles: {
        backgroundColor?: string;
        textColor?: string;
        titleColor?: string;
        cardBg?: string;
        cardStyles: DynamicCardProps['styles'];
        gap?: string;
        padding?: string;
    };
}
