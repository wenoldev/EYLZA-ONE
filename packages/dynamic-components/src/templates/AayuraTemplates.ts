import type { ImageBannerConfig } from '../types/ImageBanner';
import type { SliderConfig } from '../types/Slider';

export const aayuraSaleBanner: ImageBannerConfig = {
  imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?q=80&w=2070&auto=format&fit=crop",
  title: "<span style='font-size: 12rem; font-weight: 900; background: url(https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>SALE</span>",
  subTitle: "UP TO 50% OFF",
  description: "Big savings on our best-selling blouses and sarees.",
  textAlignment: 'center',
  verticalAlignment: 'center',
  fullWidth: true,
  layout: 'background',
  buttons: [
    { label: "SHOP THE SALE", link: "/collections/sale", style: 'primary' }
  ],
  styles: {
    backgroundColor: "#000000",
    titleColor: "#ffffff",
    height: "100vh"
  }
};

export const aayuraCategories: SliderConfig = {
  title: "Shop by Category",
  template: 'category',
  items: [
    { title: "Sarees", imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop", link: "/category/sarees" },
    { title: "Blouses", imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977730f90?q=80&w=1968&auto=format&fit=crop", link: "/category/blouses" },
    { title: "Lehengas", imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974&auto=format&fit=crop", link: "/category/lehengas" },
    { title: "Kurtas", imageUrl: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1974&auto=format&fit=crop", link: "/category/kurtas" },
    { title: "Dupattas", imageUrl: "https://images.unsplash.com/photo-1609132718484-93510e14cba0?q=80&w=1974&auto=format&fit=crop", link: "/category/dupattas" }
  ],
  itemsPerView: { desktop: 5, tablet: 4, mobile: 2 },
  styles: {
    backgroundColor: "#ffffff",
    padding: "4rem 0",
    gap: "2rem",
    cardStyles: {
      imageShape: 'circle',
      textAlign: 'center',
      aspectRatio: '1/1'
    }
  }
};

export const aayuraPromo: ImageBannerConfig = {
  imageUrl: "https://images.unsplash.com/photo-1617142108319-66c7ab468b5b?q=80&w=2070&auto=format&fit=crop",
  title: "Enjoy special offers on your first order",
  subTitle: "WELCOME OFFER",
  description: "Get Reward with your purchase. Register now to avail the offer.",
  textAlignment: 'left',
  verticalAlignment: 'center',
  fullWidth: true,
  layout: 'split',
  imagePosition: 'right',
  buttons: [
    { label: "GET IT NOW", link: "/register", style: 'secondary' }
  ],
  styles: {
    backgroundColor: "#7c3aed",
    titleColor: "#ffffff",
    subTitleColor: "#e9d5ff",
    descriptionColor: "#f3f4f6",
    height: "60vh"
  }
};
