import React from 'react';
import type { MediaTextSectionConfig } from './types/MediaTextSection';

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
    roundedCorners = '1rem',
    shadow
  } = styles;

  const buttonStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-800 text-white hover:bg-gray-900',
    outline: 'border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'
  };

  const alignmentClasses: Record<string, string> = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  return (
    <section
      className={`py-16 md:py-24 ${sectionWidth === 'full' ? 'w-full' : 'container mx-auto px-4'}`}
      style={{ backgroundColor }}
    >
      <div className={`flex flex-col ${mediaPosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-20`}>
        {/* Content Area */}
        <div className={`flex-1 flex flex-col ${alignmentClasses[buttonAlignment]}`}>
          {subTitle && (
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">
              {subTitle}
            </span>
          )}
          <h2
            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
            style={{ color: textColor }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
          {description && (
            <div
              className="text-lg text-gray-600 mb-8 leading-relaxed"
              style={{ color: textColor, opacity: 0.8 }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {buttons.map((btn, index) => (
                <a
                  key={index}
                  href={btn.link}
                  className={`px-8 py-3 rounded-md font-semibold transition-all duration-300 ${buttonStyles[btn.style]}`}
                >
                  {btn.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Media Area */}
        <div className="flex-1 w-full">
          <div
            className="relative overflow-hidden shadow-2xl"
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
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
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
