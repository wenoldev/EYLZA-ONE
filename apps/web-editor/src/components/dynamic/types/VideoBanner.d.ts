export interface VideoBannerConfig {
  videoUrl: string;
  posterUrl?: string;
  autoPlay: boolean;
  muted: boolean;
  loop: boolean;
  title: string;
  subTitle?: string;
  textAlignment: 'left' | 'center' | 'right';
  overlay: {
    color: string;
    opacity: number;
  };
  buttons: {
    label: string;
    link: string;
    style: 'primary' | 'secondary' | 'outline';
  }[];
  styles: {
    titleFontSize?: string;
    titleColor?: string;
    subTitleFontSize?: string;
    subTitleColor?: string;
    spacing?: string;
    height?: string;
  };
}
