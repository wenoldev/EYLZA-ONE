import { lazy } from 'react';

export const ComponentRegistry = {
    banner: lazy(() => import('../components/themes/ImageBanner')),
    slider: lazy(() => import('../components/themes/Slider')),
    carousel: lazy(() => import('../components/themes/Carousel')),
    grid: lazy(() => import('../components/themes/MasonryGallerySection')),
    productList: lazy(() => import('../components/themes/ProductList')),
    productDetail: lazy(() => import('../components/themes/ProductDetail')),
    "primary-header": lazy(() => import('../components/themes/Header')),
    "primary-footer": lazy(() => import('../components/themes/Footer')),
    accordion: lazy(() => import('../components/themes/Accordion')),
    collectionGrid: lazy(() => import('../components/themes/CollectionGrid')),
    contact: lazy(() => import('../components/themes/ContactSection')),
    login: lazy(() => import('../components/themes/LoginSection')),
    cart: lazy(() => import('../components/themes/CartSection')),
    checkout: lazy(() => import('../components/themes/CheckoutSection')),
    orders: lazy(() => import('../components/themes/OrdersSection')),
    mediaText: lazy(() => import('../components/themes/MediaTextSection')),
    text: lazy(() => import('../components/themes/TextContent')),
    testimonialGrid: lazy(() => import('../components/themes/TestimonialGrid')),
    
    // Aurelian Theme Components
    aurelianHero: lazy(() => import('../components/themes/aurelian/AurelianHero')),
    aurelianFeatured: lazy(() => import('../components/themes/aurelian/AurelianFeatured')),
    aurelianStory: lazy(() => import('../components/themes/aurelian/AurelianStory')),
    aurelianSpotlight: lazy(() => import('../components/themes/aurelian/AurelianSpotlight')),
    aurelianJournal: lazy(() => import('../components/themes/aurelian/AurelianJournal')),
    aurelianLogin: lazy(() => import('../components/themes/aurelian/AurelianLogin')),
    aurelianProductList: lazy(() => import('../components/themes/aurelian/AurelianProductList')),
    aurelianProductDetail: lazy(() => import('../components/themes/aurelian/AurelianProductDetail')),
    aurelianCart: lazy(() => import('../components/themes/aurelian/AurelianCart')),
};

export type ComponentType = keyof typeof ComponentRegistry;

export * from './productListTemplates';
