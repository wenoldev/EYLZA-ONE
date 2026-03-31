import type { ImageBannerConfig } from '../types/ImageBanner';
import type { MediaTextSectionConfig } from '../types/MediaTextSection';
import type { SliderConfig } from '../types/Slider';

export const zaraishkaHero: ImageBannerConfig = {
  imageUrl: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?q=80&w=2070&auto=format&fit=crop",
  title: "Wear Your Story.",
  subTitle: "HANDMADE JEWELRY FOR EVERY MOMENT",
  description: "",
  textAlignment: 'center',
  verticalAlignment: 'center',
  fullWidth: true,
  layout: 'background',
  buttons: [
    { label: "SHOP NOW", link: "/collections/all", style: 'boxed-outline' }
  ],
  styles: {
    backgroundColor: "#f4f4f0",
    titleFontSize: "5rem",
    titleColor: "#333333",
    subTitleColor: "#8b8b8b",
    subTitleFontSize: "0.875rem",
    fontFamily: 'serif',
    height: "100vh"
  }
};

export const zaraishkaAbout: MediaTextSectionConfig = {
  mediaType: 'image',
  mediaUrl: "https://images.unsplash.com/photo-1573408301185-9146fe624df0?q=80&w=2070&auto=format&fit=crop",
  mediaPosition: 'left',
  sectionWidth: 'boxed',
  title: "A Perfect Gift",
  subTitle: "FOR HER",
  description: "Express your love with our curated collection of timeless jewelry. Each piece is crafted with care to make every moment unforgettable.",
  buttons: [
    { label: "SHOP NOW", link: "/collections/gifts", style: 'outline' }
  ],
  styles: {
    backgroundColor: "#ffffff",
    textColor: "#333333",
    buttonAlignment: 'left'
  }
};

export const zaraishkaTestimonials: SliderConfig = {
  title: "What Customer says about us.",
  template: 'minimal',
  items: [
    {
      title: "Tanika Sehgal",
      subtitle: "I absolutely love the earrings I bought! They are even more beautiful in person. I will definitely be back for more."
    },
    {
      title: "Radhika Maavi",
      subtitle: "The packaging was so beautiful and the jewelry is top notch. I've received so many compliments on my necklace."
    },
    {
      title: "Ankit Jain",
      subtitle: "Great quality and fast shipping. Highly recommend Zarishka for anyone looking for unique jewelry pieces."
    }
  ],
  itemsPerView: { desktop: 3, tablet: 2, mobile: 1 },
  styles: {
    backgroundColor: "#f9f9f7",
    padding: "5rem 0",
    gap: "2rem",
    cardStyles: {
      textAlign: 'center',
      titleColor: '#333333',
      subtitleColor: '#666666'
    }
  }
};
