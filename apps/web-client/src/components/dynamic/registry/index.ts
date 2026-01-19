
import { lazy } from 'react';

export const ComponentRegistry = {
    banner: lazy(() => import('@/components/dynamic/ImageBanner')),
    slider: lazy(() => import('@/components/dynamic/slider')),
    carousel: lazy(() => import('@/components/dynamic/Carousel')),
    grid: lazy(() => import('@/components/dynamic/MasonryGallerySection')),
    productList: lazy(() => import('@/components/dynamic/ProductList')),
    productDetail: lazy(() => import('@/components/dynamic/ProductDetail')),
    // text: lazy(() => import('@/components/dynamic/TextSection')),
    header: lazy(() => import('@/components/dynamic/Header')),
    footer: lazy(() => import('@/components/dynamic/Footer')),
    accordion: lazy(() => import('@/components/dynamic/Accordion')),
};

export type ComponentType = keyof typeof ComponentRegistry;
