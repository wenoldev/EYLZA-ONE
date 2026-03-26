export interface ImageBannerConfig {
  backgroundType?: 'image' | 'color';
  imageUrl?: string;
  backgroundImage?: string;
  mobileImageUrl?: string;
  title: string;
  subTitle?: string;
  subtitle?: string; // schema fallback
  description?: string;
  layout?: 'background' | 'split';
  imagePosition?: 'left' | 'right';
  textAlignment: 'left' | 'center' | 'right';
  verticalAlignment: 'top' | 'center' | 'bottom';
  fullWidth: boolean;
  reverseOrder?: boolean;
  viewportSize?: string;
  overlay?: {
    color: string;
    opacity: number;
    show?: boolean;
  };
  buttons: {
    label: string;
    link: string;
    style: 'primary' | 'secondary' | 'outline';
    showArrow?: boolean;
    backgroundColor?: string;
    borderRadius?: number;
    textColor?: string;
    padding?: string;
    contentAlignment?: 'center' | 'start' | 'end';
    fontFamily?: string;
    fontSize?: number;
  }[];
  ctaText?: string;
  ctaLink?: string;
  template?: string;
  showTitle?: boolean;
  showSubtitle?: boolean;
  showDescription?: boolean;
  height?: number;
  backgroundColor?: string;
  imageFit?: 'cover' | 'contain';
  imageBorderRadius?: number;
  imagePadding?: number;
  styles: {
    titleFontSize?: string;
    titleColor?: string;
    titleWeight?: string;
    titleFontFamily?: string;
    titleLetterSpacing?: number;
    titleOpacity?: number;
    subTitleFontSize?: string;
    subTitleColor?: string;
    subTitleFontFamily?: string;
    subTitleLetterSpacing?: number;
    descriptionFontSize?: string;
    descriptionColor?: string;
    backgroundColor?: string;
    height?: string;
    borderRadius?: string;
  };
}
