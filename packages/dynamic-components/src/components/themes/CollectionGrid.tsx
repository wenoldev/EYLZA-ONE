import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CollectionGridConfig } from '../../types/CollectionGrid';
import TemplateRenderer from '../theme-support/TemplateRenderer';

const CollectionGrid: React.FC<CollectionGridConfig> = (config) => {
    const {
        title,
        subtitle,
        items = [],
        layout = 'grid',
        template = 'categoryCard1',
        showArrows = true,
        arrowPosition = 'sides',
        itemsPerRow = { desktop: 4, tablet: 2, mobile: 1 },
        styles = {
            gap: 24,
            padding: '6rem 0',
            backgroundColor: '#ffffff'
        }
    } = config;

    const containerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollState = () => {
        if (containerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        if (layout === 'slider') {
            updateScrollState();
            window.addEventListener('resize', updateScrollState);
            return () => window.removeEventListener('resize', updateScrollState);
        }
    }, [items, layout]);

    const handleScroll = (direction: 'left' | 'right') => {
        if (containerRef.current) {
            const { clientWidth } = containerRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
            containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!items || items.length === 0) return null;

    const sectionId = `cat-grid-${title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || Math.random().toString(36).substr(2, 9)}`;

    const renderArrows = (pos: 'top' | 'sides' | 'bottom') => {
        if (!showArrows || layout !== 'slider') return null;
        
        const arrowClasses = {
            top: "flex items-center gap-2 mb-8 justify-end",
            sides: "absolute inset-y-0 -mx-4 flex items-center justify-between w-[calc(100%+2rem)] pointer-events-none z-10",
            bottom: "flex items-center gap-4 mt-12 justify-center"
        };

        const buttonBase = "p-3 rounded-full border border-black/10 transition-all duration-300 flex items-center justify-center pointer-events-auto shadow-sm";
        const enabledClasses = "bg-white hover:bg-black hover:text-white hover:border-black active:scale-95";
        const disabledClasses = "bg-gray-50 text-gray-300 cursor-not-allowed opacity-50";

        return (
            <div className={arrowClasses[pos]}>
                <button
                    onClick={() => handleScroll('left')}
                    disabled={!canScrollLeft}
                    className={`${buttonBase} ${canScrollLeft ? enabledClasses : disabledClasses}`}
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={() => handleScroll('right')}
                    disabled={!canScrollRight}
                    className={`${buttonBase} ${canScrollRight ? enabledClasses : disabledClasses}`}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        );
    };

    return (
        <section 
            id={sectionId}
            className="w-full relative overflow-hidden" 
            style={{ 
                backgroundColor: styles.backgroundColor, 
                padding: styles.padding
            }}
        >
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    {(title || subtitle) && (
                        <div className="flex flex-col italic">
                            {title && <h2 className="text-3xl md:text-5xl font-serif tracking-tight mb-4">{title}</h2>}
                            {subtitle && <p className="text-lg opacity-60 font-light">{subtitle}</p>}
                        </div>
                    )}
                    {arrowPosition === 'top' && renderArrows('top')}
                </div>

                <div className="relative">
                    {arrowPosition === 'sides' && renderArrows('sides')}
                    
                    <div
                        ref={containerRef}
                        onScroll={updateScrollState}
                        className={`${layout === 'slider' ? 'flex overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4' : 'grid'}`}
                        style={{ 
                            gap: `${styles.gap}px`,
                            gridTemplateColumns: layout === 'grid' ? `repeat(${itemsPerRow.desktop}, minmax(0, 1fr))` : 'none'
                        }}
                    >
                        {items.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`${layout === 'slider' ? 'snap-start shrink-0' : ''}`}
                                style={{
                                    width: layout === 'slider' 
                                        ? `calc((100% - (${styles.gap}px * (${itemsPerRow.desktop} - 1))) / ${itemsPerRow.desktop})` 
                                        : 'auto',
                                    minWidth: layout === 'slider' ? '280px' : 'auto'
                                }}
                            >
                                <TemplateRenderer
                                    template={template}
                                    data={item}
                                    styles={styles.cardStyles}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {arrowPosition === 'bottom' && renderArrows('bottom')}
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                
                @media (max-width: 1024px) {
                    #${sectionId} .grid {
                        grid-template-columns: repeat(${itemsPerRow.tablet}, minmax(0, 1fr)) !important;
                    }
                    #${sectionId} .shrink-0 {
                        width: calc((100% - (${styles.gap}px * (${itemsPerRow.tablet} - 1))) / ${itemsPerRow.tablet}) !important;
                        min-width: 240px;
                    }
                }
                @media (max-width: 640px) {
                    #${sectionId} .grid {
                        grid-template-columns: repeat(${itemsPerRow.mobile}, minmax(0, 1fr)) !important;
                    }
                    #${sectionId} .shrink-0 {
                        width: calc((100% - (${styles.gap}px * (${itemsPerRow.mobile} - 1))) / ${itemsPerRow.mobile}) !important;
                        min-width: 200px;
                    }
                }
            `}</style>
        </section>
    );
};

export default CollectionGrid;
