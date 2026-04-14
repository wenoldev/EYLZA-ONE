import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ProductDetailMain } from '../theme-support/ProductDetailMain';
import type { ProductDetailConfig } from '../../types/ProductDetail';
import { getBridge, isEditorRuntime } from '../../utils/runtime';

interface ProductDetailProps {
    config: ProductDetailConfig;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ config }) => {
    const { productId } = useParams<{ productId: string }>();
    const isEditor = isEditorRuntime();
    const bridge = getBridge();
    const productStore = bridge.useProductStore?.();

    // Reconcile live product data with component configuration
    const liveConfig = useMemo(() => {
        if (isEditor || !productStore || !productStore.currentProduct) return config;

        const cp = productStore.currentProduct;
        return {
            ...config,
            product: {
                ...config.product,
                id: cp.id,
                name: cp.name,
                price: cp.price,
                originalPrice: cp.original_price,
                description: cp.description,
                images: cp.images?.map((img: any) => img.url) || [],
                label: cp.category_ids?.[0] || 'ZARISHKA',
            }
        };
    }, [config, isEditor, productStore?.currentProduct]);

    return <ProductDetailMain config={liveConfig} />;
};

export default ProductDetail;
