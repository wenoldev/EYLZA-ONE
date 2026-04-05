/* eslint-disable @typescript-eslint/no-explicit-any */
/* Enhanced Column interface to support badge and action types */
export interface Column {
  name: string;
  value: string;
  prefix?: string;
  trim?: number;
  type?: 'status' | 'date' | 'badge' | 'action' | 'custom';
  format?: string;
  isSort?: boolean;
  render?: (row: any) => React.ReactNode;
}

/* Badge configuration for type: 'badge' */
export interface BadgeConfig {
  [key: string]: {
    label: string;
    className: string;
  };
}

/* Action button configuration for type: 'action' */
export interface ActionButton {
  label: string;
  onClick: (row: any) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  color?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export interface TableConfig {
  badges?: Record<string, BadgeConfig>;
  actions?: Record<string, ActionButton[]>;
  onRowClick?: (row: any) => void;
}

interface ImageUrl {
  fileName: string
  fileContent: string
}

export interface ImageData {
  image_url: ImageUrl | string
  isPrimary?: boolean
}

export interface VideoUrl {
  fileName: string
  fileContent: string
}

export interface VideoData {
  video_url: VideoUrl | string
  isPrimary?: boolean
}