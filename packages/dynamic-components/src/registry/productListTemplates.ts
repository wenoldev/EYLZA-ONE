import { lazy } from 'react';

export const TEMPLATE_MAP: any = {
    category: lazy(() => import('../templates/productlist/CategoryTemplate')),
    product: lazy(() => import('../templates/productlist/ProductTemplate')),
    minimal: lazy(() => import('../templates/productlist/MinimalTemplate')),
    categoryCard1: lazy(() => import('../templates/FeaturedCategoryTemplates').then(m => ({ default: m.CategoryCard1 }))),
    categoryCard2: lazy(() => import('../templates/FeaturedCategoryTemplates').then(m => ({ default: m.CategoryCard2 }))),
};

export type TemplateType = keyof typeof TEMPLATE_MAP;