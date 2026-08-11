import React, { useState, useMemo } from 'react';
import type { ProductListConfig } from '../../types/ProductList';
import ProductFilters from './ProductFilters';
import ProductGridUI from './ProductGridUI';

const ProductListMain: React.FC<{config:ProductListConfig,items:any[]}> = ({config,items}) => {
  const [currentSort, setCurrentSort] = useState('alphabetical-az');
  const [filters, setFilters] = useState({ availability: [], priceRange: { min: 0, max: 10000 } });
  
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Sorting Logic
    if (currentSort === 'alphabetical-az') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (currentSort === 'alphabetical-za') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (currentSort === 'price-low-high') {
      result.sort((a, b) => {
          const priceA = parseFloat(a.price?.replace(/[^0-9.]/g, '') || 0);
          const priceB = parseFloat(b.price?.replace(/[^0-9.]/g, '') || 0);
          return priceA - priceB;
      });
    } else if (currentSort === 'price-high-low') {
        result.sort((a, b) => {
            const priceA = parseFloat(a.price?.replace(/[^0-9.]/g, '') || 0);
            const priceB = parseFloat(b.price?.replace(/[^0-9.]/g, '') || 0);
            return priceB - priceA;
        });
    }

    return result;
  }, [items, currentSort]);

  return (
    <ProductGridUI 
      config={config} 
      items={filteredAndSortedItems}
      filters={
        (config.filterConfig?.showFilters || config.filterConfig?.showSort) && (
            <ProductFilters 
                config={config.filterConfig}
                totalProducts={filteredAndSortedItems.length}
                onFilterChange={setFilters}
                onSortChange={setCurrentSort}
            />
        )
      }
    />
  );
};

export default ProductListMain;
