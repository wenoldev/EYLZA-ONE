export interface ImageBannerConfig {
  imageUrl: string;
  mobileImageUrl?: string;
  title: string;
  subTitle?: string;
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
  };
  buttons: {
    label: string;
    link: string;
    style: 'primary' | 'secondary' | 'outline';
    showArrow?: boolean;
  }[];
  styles: {
    titleFontSize?: string;
    titleColor?: string;
    titleWeight?: string;
    subTitleFontSize?: string;
    subTitleColor?: string;
    descriptionFontSize?: string;
    descriptionColor?: string;
    backgroundColor?: string;
    height?: string;
    borderRadius?: string;
  };
}
