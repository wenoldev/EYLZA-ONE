export interface CarouselItem {
    image: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    textAlignment?: 'left' | 'center' | 'right';
    overlayOpacity?: number;
}

export interface CarouselConfig {
    items: CarouselItem[];
    height?: string; // e.g., '500px', '70vh', 'screen'
    autoplay?: boolean;
    interval?: number;
    indicatorPosition?: 'left' | 'center' | 'right';
    showArrows?: boolean;
    animationType?: 'fade'; // Currently only fade as requested
}

export interface CarouselProps {
    config: CarouselConfig;
}
