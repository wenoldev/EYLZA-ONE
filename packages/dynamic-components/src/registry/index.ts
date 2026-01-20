import { lazy } from 'react';

export const ComponentRegistry = {
    banner: lazy(() => import('../components/themes/ImageBanner')),
    slider: lazy(() => import('../components/themes/Slider')),
    carousel: lazy(() => import('../components/themes/Carousel')),
    grid: lazy(() => import('../components/themes/MasonryGallerySection')),
    productList: lazy(() => import('../components/themes/ProductList')),
    productDetail: lazy(() => import('../components/themes/ProductDetail')),
    header: lazy(() => import('../components/themes/Header')),
    footer: lazy(() => import('../components/themes/Footer')),
    accordion: lazy(() => import('../components/themes/Accordion')),
};

export type ComponentType = keyof typeof ComponentRegistry;

export * from './productListTemplates';
