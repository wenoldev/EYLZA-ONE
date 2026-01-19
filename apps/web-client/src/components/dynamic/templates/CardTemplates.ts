import type { CardConfig } from '../types/Card';

export const cardDesign1: CardConfig = {
    template: 'design1',
    title: "Product Title",
    description: "This is a brief description of the product or service.",
    image: "/placeholder.svg",
    badge: "New",
    footer: "Last updated 3 mins ago",
    styles: {
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        badgeColor: "#2563eb",
        badgeTextColor: "#ffffff",
        borderRadius: "lg",
        shadow: "md",
        padding: "1rem"
    }
};

export const cardDesign2: CardConfig = {
    ...cardDesign1,
    template: 'design2',
    styles: {
        ...cardDesign1.styles,
        borderRadius: "none",
        shadow: "none",
        backgroundColor: "#f9fafb"
    }
};

export const cardTemplates: Record<string, CardConfig> = {
    design1: cardDesign1,
    design2: cardDesign2
};
