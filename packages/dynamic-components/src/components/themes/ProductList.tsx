import React, { useState, useEffect } from 'react';
import ProductListMain from '../theme-support/ProductListMain';
import type { ProductListConfig } from '../../types/ProductList';
import Loader from '../theme-support/Loader';
// Note: getProductListItems should ideally be passed as a prop or moved to a common package

const ProductList: React.FC<Omit<ProductListConfig, 'items'>> = (config) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // @ts-ignore
    if (typeof getProductListItems === 'function') {
      // @ts-ignore
      getProductListItems().then(data => {
        setItems(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return <ProductListMain {...config} items={items} />;
};

export default ProductList;
