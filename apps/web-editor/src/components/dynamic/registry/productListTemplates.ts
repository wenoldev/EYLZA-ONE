import { lazy } from 'react';

export const TEMPLATE_MAP: any = {
    category: lazy(() => import('@/components/dynamic/templates/productlist/CategoryTemplate')),
    product: lazy(() => import('@/components/dynamic/templates/productlist/ProductTemplate')),
    minimal: lazy(() => import('@/components/dynamic/templates/productlist/MinimalTemplate')),
};

export type TemplateType = keyof typeof TEMPLATE_MAP;