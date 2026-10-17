export interface CarouselItem {
    image: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLabel?: string;
    buttonLink?: string;
    textAlignment?: 'left' | 'center' | 'right';
    overlayOpacity?: number;
}

export interface CarouselConfig {
    items: CarouselItem[];
    height?: string; // e.g., '500px', '70vh', 'screen'
    autoplay?: boolean;
    autoPlay?: boolean;
    interval?: number;
    indicatorPosition?: 'left' | 'center' | 'right';
    showArrows?: boolean;
    showDots?: boolean;
    loop?: boolean;
    pauseOnHover?: boolean;
    animationType?: 'fade'; // Currently only fade as requested
    styles?: Record<string, any>;
}

export interface CarouselProps {
    config: CarouselConfig;
}
