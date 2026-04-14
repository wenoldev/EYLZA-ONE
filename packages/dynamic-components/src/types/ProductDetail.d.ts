export interface ProductDetailConfig {
    template?: 'default' | 'zarishka';
    layout: 'split' | 'stacked' | 'grid';
    product?: {
        id: string;
        name: string;
        price: number;
        originalPrice?: number;
        badge?: string;
        label?: string;
        reviewCount?: number;
        rating?: number;
        stockText?: string;
        description?: string;
        images?: string[];
        options?: {
            label: string;
            values: string[];
        }[];
        metadata?: {
            label: string;
            value: string;
        }[];
    };
    faqItems?: {
        title: string;
        content: string;
    }[];
    reviewItems?: {
        author: string;
        body: string;
        rating?: number;
        meta?: string;
    }[];
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
