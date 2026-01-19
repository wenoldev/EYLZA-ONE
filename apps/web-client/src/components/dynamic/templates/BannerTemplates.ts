import type { BannerConfig } from '../types/Banner';

export const bannerDesign1: BannerConfig = {
    template: 'design1',
    title: "Welcome to Our Store",
    subtitle: "Discover our amazing collection of products.",
    backgroundColor: "#2563eb",
    textColor: "#ffffff",
    height: "h-64",
    overlay: true
};

export const bannerDesign2: BannerConfig = {
    ...bannerDesign1,
    template: 'design2',
    backgroundColor: "#1f2937",
    height: "h-96"
};

export const bannerTemplates: Record<string, BannerConfig> = {
    design1: bannerDesign1,
    design2: bannerDesign2
};
