import React from 'react';
import type { ProductListConfig } from '../../types/ProductList';
import TemplateRenderer from './TemplateRenderer';

const DEFAULT_ITEMS = [
  { title: "Men", image: "https://images.unsplash.com/photo-1490515124029-79a061803761?w=800&auto=format&fit=crop", subtitle: "Shop Men's" },
  { title: "Women", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop", subtitle: "Shop Women's" },
  { title: "Kids", image: "https://images.unsplash.com/photo-1514066558159-fc8c737ef259?w=800&auto=format&fit=crop", subtitle: "Shop Kids'" },
  { title: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop", subtitle: "Shop Now" }
];

const ProductListMain: React.FC<ProductListConfig> = (config) => {
  const items = config.items || DEFAULT_ITEMS;
  const template = config.template || 'category';
  const layout = {
    desktop: config.layout?.desktop ?? 4,
    tablet: config.layout?.tablet ?? 2,
    mobile: config.layout?.mobile ?? 1
  };

  const styles = {
    gap: config.styles?.gap ?? 24,
    paddingTop: config.styles?.paddingTop ?? 48,
    paddingBottom: config.styles?.paddingBottom ?? 48,
    containerWidth: config.styles?.containerWidth ?? 1280,
    showTitle: config.styles?.showTitle ?? true,
    showSubtitle: config.styles?.showSubtitle ?? true,
    titleSize: config.styles?.titleSize ?? 36,
    subtitleSize: config.styles?.subtitleSize ?? 18,
    titleAlignment: config.styles?.titleAlignment ?? 'center' as const,
    backgroundColor: config.styles?.backgroundColor ?? 'transparent',
    titleColor: config.styles?.titleColor ?? '#111827',
    subtitleColor: config.styles?.subtitleColor ?? '#4b5563',
    cardStyles: {
      imageShape: config.styles?.cardStyles?.imageShape ?? 'rounded' as const,
      textAlign: config.styles?.cardStyles?.textAlign ?? 'left' as const,
      showShadow: config.styles?.cardStyles?.showShadow ?? false,
      aspectRatio: config.styles?.cardStyles?.aspectRatio ?? '1/1',
      titleColor: config.styles?.cardStyles?.titleColor,
      subtitleColor: config.styles?.cardStyles?.subtitleColor
    }
  };

  const { title, subtitle } = config;

  if (!items || items.length === 0) return null;

  const sectionId = `product-list-${title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || Math.random().toString(36).substr(2, 9)}`;

  return (
    <section
      id={sectionId}
      className="w-full product-list-section"
      style={{
        backgroundColor: styles.backgroundColor,
        paddingTop: `${styles.paddingTop ?? 48}px`,
        paddingBottom: `${styles.paddingBottom ?? 48}px`
      }}
    >
      <div
        className="mx-auto px-4"
        style={{ maxWidth: styles.containerWidth ? `${styles.containerWidth}px` : '1280px' }}
      >
        {/* Header */}
        {(styles.showTitle !== false || styles.showSubtitle !== false) && (title || subtitle) && (
          <div
            className="mb-12"
            style={{ textAlign: styles.titleAlignment || 'center' }}
          >
            {styles.showTitle !== false && title && (
              <h2
                className="font-bold mb-4"
                style={{
                  color: styles.titleColor || '#111827',
                  fontSize: `${styles.titleSize || 36}px`,
                  lineHeight: '1.2'
                }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {styles.showSubtitle !== false && subtitle && (
              <p
                className="opacity-70 max-w-2xl mx-auto"
                style={{
                  color: styles.subtitleColor || '#4b5563',
                  fontSize: `${styles.subtitleSize || 18}px`,
                  margin: styles.titleAlignment === 'center' ? '0 auto' : '0'
                }}
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}
          </div>
        )}

        {/* Grid Container */}
        <div
          className="product-grid"
          style={{
            display: 'grid',
            gap: `${styles.gap ?? 24}px`,
            gridTemplateColumns: `repeat(${layout.desktop}, minmax(0, 1fr))`
          }}
        >
          {items.map((item, index) => (
            <TemplateRenderer
              key={index}
              template={template}
              data={item}
              styles={styles.cardStyles}
            />
          ))}
        </div>
      </div>

      {/* Responsive Grid CSS */}
      <style>{`
                @media (max-width: 1024px) {
                    #${sectionId} .product-grid {
                        grid-template-columns: repeat(${layout.tablet}, minmax(0, 1fr)) !important;
                    }
                    #${sectionId} h2 {
                        font-size: ${Math.max((styles.titleSize || 36) * 0.8, 24)}px !important;
                    }
                }
                @media (max-width: 640px) {
                    #${sectionId} .product-grid {
                        grid-template-columns: repeat(${layout.mobile}, minmax(0, 1fr)) !important;
                    }
                    #${sectionId} h2 {
                        font-size: ${Math.max((styles.titleSize || 36) * 0.7, 20)}px !important;
                    }
                }
            `}</style>
    </section>
  );
};

export default ProductListMain;
