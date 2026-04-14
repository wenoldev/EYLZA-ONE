import React, { useState, useMemo } from 'react';
import type { ProductListConfig } from '../../types/ProductList';
import TemplateRenderer from './TemplateRenderer';
import ProductFilters from './ProductFilters';

const ProductListMain: React.FC<{config:ProductListConfig,items:any[]}> = ({config,items}) => {
  const [currentSort, setCurrentSort] = useState('alphabetical-az');
  const [filters, setFilters] = useState({ availability: [], priceRange: { min: 0, max: 10000 } });
  const template = config.template || 'category';
  
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

  const layout = {
    desktop: config.layout?.desktop ?? 4,
    tablet: config.layout?.tablet ?? 2,
    mobile: config.layout?.mobile ?? (template === 'zarishka' ? 2 : 1)
  };

  const styles = {
    gap: config.styles?.gap ?? 32,
    paddingTop: config.styles?.paddingTop ?? 60,
    paddingBottom: config.styles?.paddingBottom ?? 60,
    containerWidth: config.styles?.containerWidth ?? 1400,
    showTitle: config.styles?.showTitle ?? true,
    showSubtitle: config.styles?.showSubtitle ?? true,
    titleSize: config.styles?.titleSize ?? 42,
    subtitleSize: config.styles?.subtitleSize ?? 18,
    titleAlignment: config.styles?.titleAlignment ?? 'left' as const,
    backgroundColor: config.styles?.backgroundColor ?? '#ffffff',
    titleColor: config.styles?.titleColor ?? '#1a1a1a',
    subtitleColor: config.styles?.subtitleColor ?? '#666666',
    cardStyles: {
      imageShape: config.styles?.cardStyles?.imageShape ?? 'rounded' as const,
      textAlign: config.styles?.cardStyles?.textAlign ?? (template === 'zarishka' ? 'center' : 'left' as const),
      showShadow: config.styles?.cardStyles?.showShadow ?? false,
      aspectRatio: config.styles?.cardStyles?.aspectRatio ?? (template === 'zarishka' ? '1/1' : '4/5'),
      titleColor: config.styles?.cardStyles?.titleColor,
      subtitleColor: config.styles?.cardStyles?.subtitleColor
    }
  };

  const { title, subtitle } = config;



  const generatedId = React.useId().replace(/:/g, '');
  const sectionId = `product-list-${title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || generatedId}`;

  return (
    <section
      id={sectionId}
      className={`w-full product-list-section ${template === 'zarishka' ? 'zarishka-style' : ''}`}
      style={{
        backgroundColor: styles.backgroundColor,
        paddingTop: `${styles.paddingTop}px`,
        paddingBottom: `${styles.paddingBottom}px`
      }}
    >
      <div
        className="mx-auto px-6"
        style={{ maxWidth: `${styles.containerWidth}px` }}
      >
        {/* Header */}
        {(styles.showTitle !== false || styles.showSubtitle !== false) && (title || subtitle) && (
          <div
            className="mb-10"
            style={{ textAlign: styles.titleAlignment }}
          >
            {styles.showTitle !== false && title && (
              <h2
                className="mb-4"
                style={{
                  color: styles.titleColor,
                  fontSize: `${styles.titleSize}px`,
                  lineHeight: '1.1',
                  fontWeight: 400,
                  fontFamily: template === 'zarishka' ? "'Playfair Display', serif" : 'inherit'
                }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {styles.showSubtitle !== false && subtitle && (
              <p
                className="max-w-2xl"
                style={{
                  color: styles.subtitleColor,
                  fontSize: `${styles.subtitleSize}px`,
                  margin: styles.titleAlignment === 'center' ? '0 auto' : '0',
                  fontWeight: 300
                }}
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}
          </div>
        )}

        {/* Filters */}
        {(config.filterConfig?.showFilters || config.filterConfig?.showSort) && (
            <ProductFilters 
                config={config.filterConfig}
                totalProducts={filteredAndSortedItems.length}
                onFilterChange={setFilters}
                onSortChange={setCurrentSort}
            />
        )}

        {/* Grid Container */}
        {filteredAndSortedItems.length > 0 ? (
          <div
            className="product-grid"
            style={{
              display: 'grid',
              gap: `${styles.gap}px`,
              gridTemplateColumns: `repeat(${layout.desktop}, minmax(0, 1fr))`
            }}
          >
            {filteredAndSortedItems.map((item, index) => (
              <TemplateRenderer
                key={index}
                template={template}
                data={item}
                styles={styles.cardStyles}
              />
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px 0', 
            color: '#9ca3af', 
            fontSize: '18px',
            fontWeight: 300 
          }}>
            No products available
          </div>
        )}
      </div>

      {/* Responsive Grid CSS */}
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
                
                @media (max-width: 1024px) {
                    #${sectionId} .product-grid {
                        grid-template-columns: repeat(${layout.tablet}, minmax(0, 1fr)) !important;
                    }
                    #${sectionId} h2 {
                        font-size: ${Math.max(styles.titleSize * 0.8, 28)}px !important;
                    }
                }
                @media (max-width: 640px) {
                    #${sectionId} .product-grid {
                        grid-template-columns: repeat(${layout.mobile}, minmax(0, 1fr)) !important;
                        gap: ${layout.mobile > 1 ? Math.min(styles.gap, 12) : styles.gap}px !important;
                    }
                    #${sectionId} h2 {
                        font-size: ${Math.max(styles.titleSize * 0.7, 24)}px !important;
                    }
                    /* Scale down font sizes for card content in 2-column mode */
                    #${sectionId} .product-card-title {
                        font-size: ${layout.mobile > 1 ? '0.85rem' : 'inherit'} !important;
                    }
                    #${sectionId} .product-card-price {
                        font-size: ${layout.mobile > 1 ? '0.85rem' : 'inherit'} !important;
                    }
                }
            `}</style>
    </section>
  );
};

export default ProductListMain;
