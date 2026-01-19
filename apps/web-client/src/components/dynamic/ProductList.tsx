
import React, { useState, useEffect } from 'react';
import ProductListMain from './components/ProductListMain';
import type { ProductListConfig } from './types/ProductList';
import { getProductListItems } from '@/components/dynamic/libs/fetchStoreProducts';
import Loader from '@/components/common/Loader';

const ProductList: React.FC<Omit<ProductListConfig, 'items'>> = (config) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductListItems().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return <ProductListMain {...config} items={items} />;
};

export default ProductList;
