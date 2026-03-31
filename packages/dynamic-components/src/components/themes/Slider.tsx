import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
            padding: '5rem 0'
        }
    } = config;

    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollState = () => {
        if (containerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
            setScrollProgress(scrollLeft / (scrollWidth - clientWidth));
        }
    };

    useEffect(() => {
        updateScrollState();
        window.addEventListener('resize', updateScrollState);
        return () => window.removeEventListener('resize', updateScrollState);
    }, [items]);

    const handleScroll = (direction: 'left' | 'right') => {
        if (containerRef.current) {
            const { clientWidth } = containerRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
            containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!items || items.length === 0) return null;

    const sectionId = `slider-${title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || Math.random().toString(36).substr(2, 9)}`;

    return (
        <section
            id={sectionId}
            className="w-full relative overflow-hidden group/section"
            style={{ 
                backgroundColor: styles.backgroundColor, 
                padding: styles.padding,
                color: styles.textColor || 'inherit'
            }}
        >
            <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-2">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl"
                    >
                        {title && (
                            <h2
                                className={`text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-6 ${styles.fontFamily === 'serif' ? 'font-serif-premium' : 'font-serif'}`}
                                style={{ color: styles.titleColor || '#111827' }}
                                dangerouslySetInnerHTML={{ __html: title }}
                            />
                        )}
                        {subtitle && (
                            <p
                                className="text-base md:text-lg opacity-60 leading-relaxed font-light"
                                dangerouslySetInnerHTML={{ __html: subtitle }}
                            />
                        )}
                    </motion.div>

                    {/* Navigation Contols - Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => handleScroll('left')}
                            disabled={!canScrollLeft}
                            className={`group/btn p-4 rounded-full border border-current/10 transition-all duration-300 flex items-center justify-center
                                ${canScrollLeft ? 'hover:bg-primary hover:text-primary-foreground hover:border-primary scale-100' : 'opacity-20 cursor-not-allowed scale-95'}`}
                            aria-label="Previous items"
                        >
                            <ChevronLeft className="w-6 h-6 transition-transform group-hover/btn:-translate-x-0.5" />
                        </button>
                        <button
                            onClick={() => handleScroll('right')}
                            disabled={!canScrollRight}
                            className={`group/btn p-4 rounded-full border border-current/10 transition-all duration-300 flex items-center justify-center
                                ${canScrollRight ? 'hover:bg-primary hover:text-primary-foreground hover:border-primary scale-100' : 'opacity-20 cursor-not-allowed scale-95'}`}
                            aria-label="Next items"
                        >
                            <ChevronRight className="w-6 h-6 transition-transform group-hover/btn:translate-x-0.5" />
                        </button>
                    </div>
                </div>

                {/* Scroll Container with Framer Motion features */}
                <div className="relative">
                    <div
                        ref={containerRef}
                        onScroll={updateScrollState}
                        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 pt-4 -mx-4 px-4"
                        style={{ gap: styles.gap }}
                    >
                        {items.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="snap-start shrink-0"
                                style={{
                                    width: `calc((100% - (${styles.gap} * (${itemsPerView.desktop} - 1))) / ${itemsPerView.desktop})`,
                                    minWidth: '280px'
                                }}
                            >
                                <div className="p-2 h-full transition-transform duration-500 hover:-translate-y-2">
                                    <TemplateRenderer
                                        template={template}
                                        data={item}
                                        styles={{
                                            ...styles.cardStyles,
                                            // Ensure card background matches section if needed
                                            cardBg: styles.cardBg || 'transparent'
                                        }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Progress Indicator - Subtle */}
                    <div className="mt-8 flex items-center gap-4 px-2">
                        <div className="flex-1 h-[1px] bg-current/10 relative overflow-hidden">
                            <motion.div 
                                className="absolute left-0 top-0 h-full bg-primary"
                                style={{ width: `${(scrollProgress * 100) || 0}%` }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        </div>
                        <span className="text-[10px] font-bold tracking-widest uppercase opacity-40 tabular-nums">
                            {items.length} Options
                        </span>
                    </div>
                </div>

                {/* Mobile View All (Center) */}
                {viewAllLabel && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-16 flex justify-center"
                    >
                        <a
                            href={viewAllLink || '#'}
                            className="group flex items-center gap-3 px-10 py-4 bg-transparent border-2 border-current rounded-full text-current font-bold uppercase text-xs tracking-[.2em] transition-all duration-500 hover:bg-current hover:text-background hover:scale-105"
                        >
                            <span>{viewAllLabel}</span>
                            <div className="overflow-hidden w-5 h-5 relative">
                                <ArrowRight className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-full" size={20} />
                                <ArrowRight className="absolute inset-0 -translate-x-full transition-transform duration-500 group-hover:translate-x-0" size={20} />
                            </div>
                        </a>
                    </motion.div>
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
                    #${sectionId} .shrink-0 {
                        width: calc((100% - (${styles.gap} * (${itemsPerView.tablet} - 1))) / ${itemsPerView.tablet}) !important;
                        min-width: 240px;
                    }
                }
                @media (max-width: 640px) {
                    #${sectionId} .shrink-0 {
                        width: calc((100% - (${styles.gap} * (${itemsPerView.mobile} - 1))) / ${itemsPerView.mobile}) !important;
                        min-width: 180px;
                    }
                }
            `}</style>
        </section>
    );
};

export default Slider;
