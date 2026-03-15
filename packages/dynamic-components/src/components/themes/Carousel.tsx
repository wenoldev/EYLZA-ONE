import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CarouselConfig } from '../../types/Carousel';

const Carousel = ({ config }: { config: CarouselConfig }) => {
    const {
        items = [],
        height = '600px',
        autoplay = true,
        interval = 5000,
        indicatorPosition = 'right',
        showArrows = true
    } = config;

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!autoplay || items.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, interval);

        return () => clearInterval(timer);
    }, [autoplay, interval, items.length]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    if (!items || items.length === 0) return null;

    return (
        <div 
            className="relative overflow-hidden w-full group"
            style={{ height: height === 'screen' ? '100vh' : height }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Image Overlay */}
                    <div 
                        className="absolute inset-0 bg-black z-10" 
                        style={{ opacity: items[currentIndex].overlayOpacity ?? 0.3 }}
                    />
                    
                    {/* Background Image */}
                    <img
                        src={items[currentIndex].image}
                        alt={items[currentIndex].title || ""}
                        className="w-full h-full object-cover"
                    />

                    {/* Content */}
                    <div className="absolute inset-0 z-20 flex items-center px-10 md:px-20 lg:px-32">
                        <div 
                            className={`w-full max-w-4xl transition-all duration-700 ${
                                items[currentIndex].textAlignment === 'center' ? 'text-center mx-auto' : 
                                items[currentIndex].textAlignment === 'right' ? 'text-right ml-auto' : 'text-left'
                            }`}
                        >
                            <motion.h4 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-white text-sm md:text-base uppercase tracking-[0.3em] font-medium mb-4"
                            >
                                {items[currentIndex].subtitle}
                            </motion.h4>
                            <motion.h2 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-white text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8"
                            >
                                {items[currentIndex].title}
                            </motion.h2>
                            {items[currentIndex].buttonText && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <a 
                                        href={items[currentIndex].buttonLink || "#"}
                                        className="inline-block bg-white text-black px-8 py-4 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300"
                                    >
                                        {items[currentIndex].buttonText}
                                    </a>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Arrows */}
            {showArrows && items.length > 1 && (
                <>
                    <button 
                        onClick={handlePrev}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:block"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={handleNext}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:block"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Indicators */}
            {items.length > 1 && (
                <div 
                    className={`absolute bottom-10 z-30 px-10 md:px-20 flex gap-3 ${
                        indicatorPosition === 'center' ? 'left-1/2 -translate-x-1/2' :
                        indicatorPosition === 'left' ? 'left-0' : 'right-0'
                    }`}
                >
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className="group py-2"
                        >
                            <div className={`h-[2px] transition-all duration-500 rounded-full ${currentIndex === idx ? 'w-12 bg-white' : 'w-6 bg-white/30 group-hover:bg-white/60'}`} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Carousel;
