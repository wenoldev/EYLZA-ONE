import React from 'react';
import type { MasonryGallerySectionConfig } from './types/MasonryGallerySection';

const MasonryGallerySection: React.FC<MasonryGallerySectionConfig> = (config) => {
  const {
    items = [],
    imagesPerRow = 3,
    rowHeight = '300px',
    gap = '1rem',
    hoverEffect = 'zoom',
    styles = {}
  } = config;

  const hoverClasses = {
    zoom: 'hover:scale-110',
    fade: 'hover:opacity-80',
    overlay: 'group-hover:opacity-100'
  };

  return (
    <section
      className="py-12 px-4"
      style={{ backgroundColor: styles.backgroundColor }}
    >
      <div
        className="flex flex-wrap"
        style={{ gap: gap }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-lg cursor-pointer transition-all duration-500"
            style={{
              height: rowHeight,
              flex: `1 1 calc(${100 / imagesPerRow}% - ${gap})`,
              minWidth: '250px'
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.title || ''}
              className={`w-full h-full object-cover transition-transform duration-700 ${hoverEffect === 'zoom' ? hoverClasses.zoom : ''}`}
            />

            {/* Overlay Content */}
            <div className={`absolute inset-0 bg-black/40 flex flex-col justify-end p-6 transition-opacity duration-300 ${hoverEffect === 'overlay' ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
              {item.title && (
                <h3 className="text-white text-xl font-bold mb-1" style={{ color: styles.textColor }}>
                  {item.title}
                </h3>
              )}
              {item.subTitle && (
                <p className="text-white/80 text-sm mb-4" style={{ color: styles.textColor }}>
                  {item.subTitle}
                </p>
              )}
              {item.button && (
                <a
                  href={item.button.link}
                  className="inline-block bg-white text-black px-4 py-2 rounded text-sm font-semibold w-fit hover:bg-gray-200 transition-colors"
                >
                  {item.button.label}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MasonryGallerySection;
