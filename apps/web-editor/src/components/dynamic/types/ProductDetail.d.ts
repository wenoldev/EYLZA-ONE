export interface ProductDetailConfig {
    layout: 'split' | 'stacked' | 'grid';
    gallery: {
        position: 'left' | 'right' | 'top';
        showThumbnails: boolean;
        aspectRatio: string;
        imageShape: 'rounded' | 'square';
    };
    content: {
        showRating: boolean;
        showSku: boolean;
        showStock: boolean;
        showShareButtons: boolean;
        stickyInfo: boolean;
    };
    styles: {
        backgroundColor?: string;
        paddingTop?: number;
        paddingBottom?: number;
        containerWidth?: number;
        // Typography
        titleColor?: string;
        titleSize?: number;
        priceColor?: string;
        salePriceColor?: string;
        priceSize?: number;
        descriptionColor?: string;
        descriptionSize?: number;
        // Buttons
        buttonText?: string;
        buttonColor?: string;
        buttonTextColor?: string;
        buttonShape?: 'rounded' | 'square' | 'pill';
    };
}
