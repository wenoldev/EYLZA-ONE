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
    collectionGrid: lazy(() => import('../components/themes/CollectionGrid')),
    contact: lazy(() => import('../components/themes/ContactSection')),
    login: lazy(() => import('../components/themes/LoginSection')),
    cart: lazy(() => import('../components/themes/CartSection')),
    checkout: lazy(() => import('../components/themes/CheckoutSection')),
    orders: lazy(() => import('../components/themes/OrdersSection')),
};

export type ComponentType = keyof typeof ComponentRegistry;

export * from './productListTemplates';
