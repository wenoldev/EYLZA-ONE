import React, { useState, useEffect } from 'react';
import ProductGridUI from '../theme-support/ProductGridUI';
import type { ProductListConfig } from '../../types/ProductList';
import Loader from '../theme-support/Loader';
import { getProductListItems } from '../../libs/fetchStoreProducts';

const FeaturedProducts: React.FC<ProductListConfig> = (config) => {
  const [items, setItems] = useState<any[]>(config.items || []);
  const [loading, setLoading] = useState(!config.items);

  useEffect(() => {
    // If items are provided in props, don't fetch
    if (config.items && config.items.length > 0) {
      setItems(config.items);
      setLoading(false);
      return;
    }

    const fetchItems = async () => {
      try {
        const data = await getProductListItems();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [config.items]);

  if (loading) {
    return <Loader />;
  }

  return <ProductGridUI config={config} items={items} />;
};

export default FeaturedProducts;
