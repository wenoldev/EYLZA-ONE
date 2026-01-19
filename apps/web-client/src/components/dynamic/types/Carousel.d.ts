export interface CarouselItem {
    image: string;
    title: string;
    subtitle: string;
    buttonLabel?: string;
    buttonLink?: string;
}

export interface CarouselConfig {
    items: CarouselItem[];
    autoPlay: boolean;
    interval: number;
    loop: boolean;
    showArrows: boolean;
    showDots: boolean;
    pauseOnHover: boolean;
    styles: {
        height: string;
        overlayColor: string;
        textColor: string;
        accentColor: string;
        dotColor?: string;
        arrowColor?: string;
    };
}
