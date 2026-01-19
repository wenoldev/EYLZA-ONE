import React from 'react';
import type { ImageBannerConfig } from './types/ImageBanner';
import { ArrowRight } from 'lucide-react';

const ImageBanner: React.FC<ImageBannerConfig> = (props) => {
  const isMobile = props.viewportSize
    ? (props.viewportSize === 'mobile' || props.viewportSize === 'tablet')
    : (typeof window !== 'undefined' && window.innerWidth < 1024);

  const defaultConfig: Partial<ImageBannerConfig> = {
    layout: 'background',
    imageUrl: "https://essence-frames-boutique.lovable.app/assets/hero-frames-C1X-C3WU.jpg",
    title: "<span>Frame Your</span><br /><span class='golden'>Precious Moments</span>",
    subTitle: "Create beautiful, customizable photo frames with your cherished memories. Premium quality, stunning designs, delivered to your doorstep.",
    textAlignment: 'left',
    verticalAlignment: 'center',
    fullWidth: true,
    reverseOrder: false,
    buttons: [
      {
        label: "Shop Now",
        link: "#",
        style: 'primary',
        showArrow: true
      },
      {
        label: "Custom Design",
        link: "#",
        style: 'outline'
      }
    ],
    styles: {
      height: '80vh',
    }
  };

  const config = { ...defaultConfig, ...props };

  const {
    imageUrl,
    mobileImageUrl,
    title,
    subTitle,
    description,
    textAlignment = 'left',
    verticalAlignment = 'center',
    fullWidth = true,
    layout = 'background',
    imagePosition = 'right',
    reverseOrder = false,
    overlay,
    buttons = [],
    styles = {}
  } = config;

  const alignmentClasses: Record<string, string> = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right'
  };

  const verticalClasses: Record<string, string> = {
    top: 'justify-start',
    center: 'justify-center',
    bottom: 'justify-end'
  };

  const buttonStyles: Record<string, string> = {
    primary: 'bg-[#c5a059] text-white hover:bg-[#b08d4a] shadow-lg',
    secondary: 'bg-gray-800 text-white hover:bg-gray-900',
    outline: 'border-2 border-[#8b6e3f] text-[#8b6e3f] hover:bg-[#8b6e3f] hover:text-white'
  };

  const renderContent = () => {
    const content = [
      subTitle && (
        <p
          key="subtitle"
          className="text-gray-600 text-sm md:text-base mb-4 font-medium tracking-[0.2em] uppercase order-1"
          style={{
            color: styles.subTitleColor,
            fontSize: styles.subTitleFontSize
          }}
          dangerouslySetInnerHTML={{ __html: subTitle }}
        />
      ),
      <h1
        key="title"
        className={`text-5xl md:text-7xl lg:text-8xl font-serif-premium font-bold mb-8 leading-[1.1] text-gray-900 ${reverseOrder ? 'order-3' : 'order-2'}`}
        style={{
          color: styles.titleColor,
          fontSize: styles.titleFontSize,
          fontWeight: styles.titleWeight
        }}
        dangerouslySetInnerHTML={{ __html: title }}
      />,
      description && (
        <p
          key="description"
          className={`text-lg md:text-xl mb-10 text-gray-600 max-w-xl leading-relaxed ${reverseOrder ? 'order-2' : 'order-3'}`}
          style={{
            color: styles.descriptionColor,
            fontSize: styles.descriptionFontSize
          }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ),
      buttons.length > 0 && (
        <div key="buttons" className="flex flex-wrap gap-4 mt-2 order-4">
          {buttons.map((btn, index) => (
            <a
              key={index}
              href={btn.link}
              className={`group px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] flex items-center gap-2 ${buttonStyles[btn.style]}`}
            >
              {btn.label}
              {btn.showArrow && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
            </a>
          ))}
        </div>
      )
    ];

    return (
      <div className={`relative z-10 w-full p-8 md:p-20 flex flex-col ${alignmentClasses[textAlignment]} max-w-4xl animate-in fade-in slide-in-from-left-4 duration-1000`}>
        {content}
      </div>
    );
  };

  const renderImage = () => (
    <picture className={`${layout === 'background' ? 'absolute inset-0' : 'relative w-full h-full'}`}>
      {mobileImageUrl && <source media="(max-width: 768px)" srcSet={mobileImageUrl} />}
      <img
        src={imageUrl}
        alt={typeof title === 'string' ? title.replace(/<[^>]*>/g, '') : 'Banner Image'}
        className="w-full h-full object-cover"
      />
    </picture>
  );

  const overlayEl = overlay && (
    <div
      className="absolute inset-0 transition-opacity duration-300 z-5"
      style={{
        backgroundColor: overlay.color,
        opacity: overlay.opacity
      }}
    />
  );

  if (layout === 'split') {
    return (
      <section
        className={`flex flex-col md:flex-row ${imagePosition === 'left' ? 'md:flex-row-reverse' : ''} overflow-hidden ${fullWidth ? 'w-full' : 'container mx-auto rounded-3xl my-8 shadow-2xl transition-all duration-500'}`}
        style={{
          backgroundColor: styles.backgroundColor || '#fcfaf7',
          minHeight: styles.height || '70vh'
        }}
      >
        <div className={`w-full md:w-1/2 flex items-center justify-center p-4 md:p-12 relative ${isMobile ? 'order-1' : ''}`}>
          {renderContent()}
        </div>
        <div className={`w-full md:w-1/2 relative min-h-[40vh] md:min-h-full overflow-hidden ${isMobile ? 'order-2' : ''}`}>
          {renderImage()}
          {overlayEl}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative overflow-hidden ${fullWidth ? 'w-full' : 'container mx-auto px-4 rounded-3xl my-8 shadow-2xl transition-all duration-500'} flex ${verticalClasses[verticalAlignment]}`}
      style={{
        backgroundColor: styles.backgroundColor,
        minHeight: styles.height || '80vh'
      }}
    >
      <div className="absolute inset-0">
        {renderImage()}
        {overlayEl}
      </div>

      {renderContent()}
    </section>
  );
};

export default ImageBanner;

