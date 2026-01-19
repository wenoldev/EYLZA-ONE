import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselFunctionalityProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  configInterval?: number;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  pauseOnHover?: boolean;
  arrowColor?: string;
  dotColor?: string;
}

const CarouselFunctionality: React.FC<CarouselFunctionalityProps> = ({
  children,
  autoPlay = true,
  configInterval = 5000,
  loop = true,
  showArrows = true,
  showDots = true,
  pauseOnHover = true,
  arrowColor = '#ffffff',
  dotColor = '#ffffff'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev === children.length - 1) {
        return loop ? 0 : prev;
      }
      return prev + 1;
    });
  }, [children.length, loop]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return loop ? children.length - 1 : 0;
      }
      return prev - 1;
    });
  }, [children.length, loop]);

  useEffect(() => {
    if (autoPlay && !isPaused) {
      timeoutRef.current = setInterval(nextSlide, configInterval);
    }
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [autoPlay, configInterval, nextSlide, isPaused]);

  if (!children || children.length === 0) return null;

  return (
    <div
      className="relative w-full h-full group"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="w-full h-full overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="min-w-full h-full">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {showArrows && children.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20"
            style={{ color: arrowColor }}
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20"
            style={{ color: arrowColor }}
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && children.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 transition-all duration-300 rounded-full ${currentIndex === index ? 'w-8' : 'w-2 opacity-50'
                }`}
              style={{ backgroundColor: dotColor }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselFunctionality;
