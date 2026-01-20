import type { CarouselConfig } from '../types/Carousel';

export const carouselDesign1: CarouselConfig = {
  items: [
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
      title: "Mega <span class='text-blue-400'>Sale</span>",
      subtitle: "Up to 50% off on all products",
      buttonLabel: "Shop Now",
      buttonLink: "/shop"
    },
    {
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2080&auto=format&fit=crop",
      title: "New <span class='text-blue-400'>Arrival</span>",
      subtitle: "Check out our latest collection",
      buttonLabel: "Explore",
      buttonLink: "/new"
    }
  ],
  autoPlay: true,
  interval: 5000,
  loop: true,
  showArrows: true,
  showDots: true,
  pauseOnHover: true,
  styles: {
    height: "600px",
    overlayColor: "rgba(0,0,0,0.5)",
    textColor: "#ffffff",
    accentColor: "#3b82f6"
  }
};

export const carouselTemplates: Record<string, CarouselConfig> = {
  default: carouselDesign1
};
