export interface MasonryGalleryItem {
  imageUrl: string;
  title?: string;
  subTitle?: string;
  button?: {
    label: string;
    link: string;
  };
}

export interface MasonryGallerySectionConfig {
  items: MasonryGalleryItem[];
  imagesPerRow: number;
  rowHeight: string;
  gap: string;
  hoverEffect: 'zoom' | 'fade' | 'overlay';
  clickBehavior?: 'navigate' | 'modal';
  styles: {
    backgroundColor?: string;
    textColor?: string;
  };
}
