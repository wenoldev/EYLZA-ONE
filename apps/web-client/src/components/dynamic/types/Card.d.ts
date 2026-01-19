import type { Color, BorderRadius } from './Header';

export interface CardConfig {
    template: 'design1' | 'design2';
    title: string;
    description: string;
    image?: string;
    badge?: string;
    footer?: string;
    styles: {
        backgroundColor: Color;
        textColor: Color;
        badgeColor: Color;
        badgeTextColor: Color;
        borderRadius: BorderRadius;
        shadow: 'none' | 'sm' | 'md' | 'lg';
        padding: string;
    };
}

export interface CardSimpleConfig {
    template: 'design1' | 'design2';
    title?: string;
    description?: string;
    image?: string;
    badge?: string;
    footer?: string;
    color?: Color;
}
