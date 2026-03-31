export interface CollectionGridItem {
    title: string;
    subtitle?: string;
    imageUrl: string;
    link: string;
}

export interface CollectionGridConfig {
    title?: string;
    subtitle?: string;
    layout?: 'grid' | 'slider';
    template?: string;
    items: CollectionGridItem[];
    showArrows?: boolean;
    arrowPosition?: 'top' | 'sides' | 'bottom';
    itemsPerRow?: {
        desktop: number;
        tablet: number;
        mobile: number;
    };
    styles?: {
        backgroundColor?: string;
        padding?: string;
        gap?: number;
        cardStyles?: {
            imageShape?: 'circle' | 'square' | 'rounded';
            textAlign?: 'left' | 'center' | 'right';
            aspectRatio?: string;
            titleColor?: string;
            subtitleColor?: string;
        };
    };
    viewportSize?: string;
}
