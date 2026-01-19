export interface MediaTextSectionConfig {
  mediaType: 'image' | 'video';
  mediaUrl: string;
  mediaPosition: 'left' | 'right';
  sectionWidth: 'full' | 'boxed';
  title: string;
  subTitle?: string;
  description?: string;
  buttons: {
    label: string;
    link: string;
    style: 'primary' | 'secondary' | 'outline';
  }[];
  styles: {
    aspectRatio?: string;
    roundedCorners?: string;
    shadow?: string;
    padding?: string;
    spacing?: string;
    buttonAlignment: 'left' | 'center' | 'right';
    backgroundColor?: string;
    textColor?: string;
  };
}
