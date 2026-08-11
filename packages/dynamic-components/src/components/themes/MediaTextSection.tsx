import React from 'react';
import type { MediaTextSectionConfig } from '../../types/MediaTextSection';
import { cn } from '../../libs/utils';

import './MediaTextSection.css';

const MediaTextSection: React.FC<MediaTextSectionConfig> = (config) => {
  const {
    mediaType,
    mediaUrl,
    mediaPosition = 'left',
    sectionWidth = 'boxed',
    title,
    subTitle,
    description,
    buttons = [],
    styles = {
      buttonAlignment: 'left'
    }
  } = config;

  const {
    buttonAlignment = 'left',
    backgroundColor,
    textColor,
    aspectRatio = '4/3',
    roundedCorners = '0',
    shadow = 'none'
  } = styles;

  const buttonStyles = {
    primary: 'bg-stone-900 text-white hover:bg-stone-800',
    secondary: 'bg-stone-200 text-stone-900 hover:bg-stone-300',
    outline: 'border border-stone-400 text-stone-900 hover:border-stone-900 uppercase tracking-widest text-xs py-4 px-10'
  };

  const alignmentClasses: Record<string, string> = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  return (
    <section
      className={cn(
        "py-20 md:py-32 overflow-hidden",
        sectionWidth === 'full' ? 'w-full' : 'container mx-auto px-6 max-w-7xl'
      )}
      style={{ backgroundColor }}
    >
      <div 
        className={cn(
          "media-text-section-wrapper gap-12 md:gap-24 lg:gap-32",
          mediaPosition === 'right' ? "position-right" : "position-left"
        )}
      >
        {/* Content Area */}
        <div 
          className={cn(
            "flex-1 flex flex-col w-full",
            alignmentClasses[buttonAlignment]
          )}
        >
          {subTitle && (
            <span className="text-stone-500 font-sans tracking-[0.2em] uppercase text-[10px] md:text-xs mb-4">
              {subTitle}
            </span>
          )}
          <h2
            className="font-serif text-4xl md:text-5xl lg:text-7xl mb-8 leading-[1.1] text-stone-900"
            style={{ color: textColor }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
          {description && (
            <div
              className="text-base md:text-lg text-stone-600 mb-10 leading-relaxed font-sans max-w-xl"
              style={{ color: textColor, opacity: 0.9 }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-6">
              {buttons.map((btn, index) => (
                <a
                  key={index}
                  href={btn.link}
                  className={cn(
                    "inline-flex items-center justify-center font-medium transition-all duration-300",
                    buttonStyles[btn.style]
                  )}
                >
                  {btn.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Media Area */}
        <div className="flex-1 w-full order-first md:order-none">
          <div
            className="relative overflow-hidden w-full h-full"
            style={{
              aspectRatio,
              borderRadius: roundedCorners,
              boxShadow: shadow
            }}
          >
            {mediaType === 'image' ? (
              <img
                src={mediaUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
              />
            ) : (
              <video
                src={mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaTextSection;
