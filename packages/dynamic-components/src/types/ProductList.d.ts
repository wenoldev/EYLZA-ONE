export interface ProductListConfig {
  title?: string;
  subtitle?: string;
  items: any[];
  template: 'category' | 'product' | 'minimal' | 'zarishka';
  filterConfig?: {
    showFilters?: boolean;
    showSort?: boolean;
    options?: ('availability' | 'price')[];
  };
  layout: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  styles: {
    backgroundColor?: string;
    titleColor?: string;
    subtitleColor?: string;
    // Spacing in PX
    gap?: number;
    paddingTop?: number;
    paddingBottom?: number;
    containerWidth?: number;
    // Card Styles
    cardStyles: {
      imageShape?: 'circle' | 'square' | 'rounded';
      aspectRatio?: string;
      textAlign?: 'left' | 'center' | 'right';
      titleColor?: string;
      subtitleColor?: string;
      showShadow?: boolean;
    };
    // Content Options
    showTitle?: boolean;
    showSubtitle?: boolean;
    titleSize?: number;
    subtitleSize?: number;
    titleAlignment?: 'left' | 'center' | 'right';
  };
}
