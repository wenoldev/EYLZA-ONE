import type { SliderConfig } from '../types/Slider';

export const sliderCategoryTemplate: SliderConfig = {
  title: "Shop by <span class='text-blue-600'>Category</span>",
  subtitle: "Explore our wide range of premium collections",
  viewAllLabel: "View All Categories",
  viewAllLink: "/categories",
  template: 'category',
  items: [
    {
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
      title: "Earrings",
      subtitle: "45 Products"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
      title: "Bracelet",
      subtitle: "30 Products"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop",
      title: "Necklace",
      subtitle: "56 Products"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
      title: "Rings",
      subtitle: "30 Products"
    }
  ],
  itemsPerView: {
    desktop: 4,
    tablet: 3,
    mobile: 2
  },
  styles: {
    backgroundColor: "#fffdf9",
    titleColor: "#111827",
    gap: "2.5rem",
    padding: "5rem 0",
    cardStyles: {
      imageShape: 'circle',
      textAlign: 'center',
      titleColor: '#111827',
      subtitleColor: '#6b7280',
      aspectRatio: '1/1'
    }
  }
};

export const sliderTemplates: Record<string, SliderConfig> = {
  category: sliderCategoryTemplate
};
