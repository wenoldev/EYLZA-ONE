import React from 'react';
import type { VideoBannerConfig } from './types/VideoBanner';

const VideoBanner: React.FC<VideoBannerConfig> = (config) => {
  const {
    videoUrl,
    posterUrl,
    autoPlay = true,
    muted = true,
    loop = true,
    title,
    subTitle,
    textAlignment = 'center',
    overlay,
    buttons = [],
    styles = {}
  } = config;

  const alignmentClasses: Record<string, string> = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right'
  };

  const buttonStyles: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-800 text-white hover:bg-gray-900',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-black'
  };

  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ minHeight: styles.height || '70vh' }}
    >
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          src={videoUrl}
          poster={posterUrl}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlay.color,
            opacity: overlay.opacity
          }}
        />
      )}

      {/* Content */}
      <div
        className={`relative z-10 w-full max-w-6xl p-8 md:p-16 flex flex-col ${alignmentClasses[textAlignment]}`}
        style={{ gap: styles.spacing }}
      >
        {subTitle && (
          <p
            className="text-xl md:text-2xl mb-2 font-medium tracking-wider uppercase"
            style={{
              color: styles.subTitleColor,
              fontSize: styles.subTitleFontSize
            }}
            dangerouslySetInnerHTML={{ __html: subTitle }}
          />
        )}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-none"
          style={{
            color: styles.titleColor,
            fontSize: styles.titleFontSize
          }}
          dangerouslySetInnerHTML={{ __html: title }}
        />

        {buttons.length > 0 && (
          <div className="flex flex-wrap gap-6 mt-4">
            {buttons.map((btn, index) => (
              <a
                key={index}
                href={btn.link}
                className={`px-10 py-4 rounded-lg font-bold transition-all duration-300 transform hover:translate-y-[-4px] shadow-lg ${buttonStyles[btn.style]}`}
              >
                {btn.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoBanner;
