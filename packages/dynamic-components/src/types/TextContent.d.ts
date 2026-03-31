import type { Color, FontFamily } from './Common';

export interface TextContentConfig {
  title?: string;
  content?: string;
  alignment?: 'left' | 'center' | 'right';
  styles?: {
    backgroundColor?: Color;
    textColor?: Color;
    titleColor?: Color;
    fontFamily?: FontFamily;
    maxWidth?: string;
    padding?: string;
  };
}
