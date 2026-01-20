import { lazy } from 'react';

export const TEMPLATE_MAP: any = {
    category: lazy(() => import('../templates/productlist/CategoryTemplate')),
    product: lazy(() => import('../templates/productlist/ProductTemplate')),
    minimal: lazy(() => import('../templates/productlist/MinimalTemplate')),
};

export type TemplateType = keyof typeof TEMPLATE_MAP;