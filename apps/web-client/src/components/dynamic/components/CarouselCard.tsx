import React from 'react';
import type { CarouselItem } from '../types/Carousel';

interface CarouselCardProps {
  item: CarouselItem;
  styles: {
    height: string;
    overlayColor: string;
    textColor: string;
    accentColor: string;
  };
}

const CarouselCard: React.FC<CarouselCardProps> = ({ item, styles }) => {
  return (
    <div
      className="min-w-full relative flex items-center justify-center overflow-hidden"
      style={{
        height: styles.height,
        backgroundImage: `url(${item.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ backgroundColor: styles.overlayColor }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl animate-in fade-in zoom-in duration-700">
        <h2
          className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
          style={{ color: styles.textColor }}
          dangerouslySetInnerHTML={{ __html: item.title }}
        />
        <p
          className="text-lg md:text-xl mb-8 opacity-90 font-medium"
          style={{ color: styles.textColor }}
          dangerouslySetInnerHTML={{ __html: item.subtitle }}
        />
        {item.buttonLabel && (
          <a
            href={item.buttonLink || '#'}
            className="inline-block px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95"
            style={{
              backgroundColor: styles.accentColor,
              color: '#ffffff'
            }}
          >
            {item.buttonLabel}
          </a>
        )}
      </div>
    </div>
  );
};

export default CarouselCard;
