import type { CardConfig, CardSimpleConfig } from '../types/Card';

export const generateCardConfig = (data: CardSimpleConfig): CardConfig => {
  const isDesign2 = data.template === 'design2';

  return {
    template: data.template || 'design1',
    title: data.title || '',
    description: data.description || '',
    image: data.image,
    badge: data.badge,
    footer: data.footer,
    styles: {
      backgroundColor: data.color || (isDesign2 ? "#f9fafb" : "#ffffff"),
      textColor: "#1f2937",
      badgeColor: "#2563eb",
      badgeTextColor: "#ffffff",
      borderRadius: isDesign2 ? "none" : "lg",
      shadow: isDesign2 ? "none" : "md",
      padding: "1rem"
    }
  };
};
