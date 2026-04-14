import React, { useState, useEffect } from 'react';
import ProductListMain from '../theme-support/ProductListMain';
import type { ProductListConfig } from '../../types/ProductList';
import Loader from '../theme-support/Loader';
import { getProductListItems } from '../../libs/fetchStoreProducts';

const ProductList: React.FC<ProductListConfig> = (config) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getProductListItems();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch product list items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return <ProductListMain config={config} items={items} />;
};

export default ProductList;
