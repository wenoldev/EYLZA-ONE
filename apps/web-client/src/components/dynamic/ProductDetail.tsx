import React from 'react';
import { ProductDetailMain } from './components/ProductDetailMain';
import type { ProductDetailConfig } from './types/ProductDetail';

interface ProductDetailProps {
    config: ProductDetailConfig;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ config }) => {
    return <ProductDetailMain config={config} />;
};

export default ProductDetail;
