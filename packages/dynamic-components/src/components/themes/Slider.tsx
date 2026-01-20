import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { SliderConfig } from '../../types/Slider';
import TemplateRenderer from '../theme-support/TemplateRenderer';

const Slider: React.FC<SliderConfig> = (config) => {
  const {
    title,
    subtitle,
    viewAllLabel,
    viewAllLink,
    items = [],
    template = 'category',
    itemsPerView = { desktop: 4, tablet: 3, mobile: 2 },
    styles = {
      cardStyles: { imageShape: 'circle', textAlign: 'center' },
      gap: '2rem',
      padding: '4rem 0'
    }
  } = config;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  const sectionId = `slider-${title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || Math.random().toString(36).substr(2, 9)}`;

  return (
    <section
      id={sectionId}
      className="w-full overflow-hidden slider-section"
      style={{ backgroundColor: styles.backgroundColor, padding: styles.padding }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div className="flex-1">
            {title && (
              <h2
                className="text-4xl md:text-5xl font-serif mb-4"
                style={{ color: styles.titleColor || '#111827' }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {subtitle && (
              <p
                className="text-lg opacity-70"
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-3 ml-4">
            <button
              onClick={() => scroll('left')}
              disabled={!showLeftArrow}
              className={`p-3 rounded-full border border-gray-200 transition-all ${showLeftArrow ? 'hover:bg-gray-900 hover:text-white opacity-100' : 'opacity-30 cursor-not-allowed'
                }`}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!showRightArrow}
              className={`p-3 rounded-full border border-gray-200 transition-all ${showRightArrow ? 'hover:bg-gray-900 hover:text-white opacity-100' : 'opacity-30 cursor-not-allowed'
                }`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Slider Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ gap: styles.gap }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="snap-start shrink-0 slider-item"
              style={{
                width: `calc((100% - (${styles.gap} * (${itemsPerView.desktop} - 1))) / ${itemsPerView.desktop})`,
                minWidth: '250px'
              }}
            >
              <TemplateRenderer
                template={template}
                data={item}
                styles={styles.cardStyles}
              />
            </div>
          ))}
        </div>

        {/* View All Button */}
        {viewAllLabel && (
          <div className="mt-12 flex justify-center">
            <a
              href={viewAllLink || '#'}
              className="flex items-center gap-2 px-8 py-3 border border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              {viewAllLabel}
              <ArrowRight size={18} />
            </a>
          </div>
        )}
      </div>

      <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @media (max-width: 1024px) {
                    #${sectionId} .slider-item {
                        width: calc((100% - (${styles.gap} * (${itemsPerView.tablet} - 1))) / ${itemsPerView.tablet}) !important;
                    }
                }
                @media (max-width: 640px) {
                    #${sectionId} .slider-item {
                        width: calc((100% - (${styles.gap} * (${itemsPerView.mobile} - 1))) / ${itemsPerView.mobile}) !important;
                    }
                }
            `}</style>
    </section>
  );
};

export default Slider;
