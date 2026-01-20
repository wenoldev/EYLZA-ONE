import React from 'react';
import type { CarouselConfig } from '../../types/Carousel';
import CarouselCard from '../theme-support/CarouselCard';
import CarouselFunctionality from '../theme-support/CarouselFunctionality';

const Carousel: React.FC<CarouselConfig> = (config) => {
  const {
    items = [],
    autoPlay = true,
    interval = 5000,
    loop = true,
    showArrows = true,
    showDots = true,
    pauseOnHover = true,
    styles = {
      height: '600px',
      overlayColor: 'rgba(0,0,0,0.4)',
      textColor: '#ffffff',
      accentColor: '#3b82f6'
    }
  } = config;

  if (!items || items.length === 0) return null;

  return (
    <section
      className="w-full overflow-hidden"
      style={{ height: styles.height }}
    >
      <CarouselFunctionality
        autoPlay={autoPlay}
        configInterval={interval}
        loop={loop}
        showArrows={showArrows}
        showDots={showDots}
        pauseOnHover={pauseOnHover}
        arrowColor={styles.arrowColor || styles.textColor}
        dotColor={styles.dotColor || styles.textColor}
      >
        {items.map((item, index) => (
          <CarouselCard
            key={index}
            item={item}
            styles={{
              height: styles.height,
              overlayColor: styles.overlayColor,
              textColor: styles.textColor,
              accentColor: styles.accentColor
            }}
          />
        ))}
      </CarouselFunctionality>
    </section>
  );
};

export default Carousel;
