import React from 'react';
import type { ImageBannerConfig } from '../../types/ImageBanner';
import { ArrowRight } from 'lucide-react';
import { StoreLink } from '../theme-support/StoreLink';

const ImageBanner: React.FC<ImageBannerConfig> = (props) => {
  const isMobile = props.viewportSize
    ? (props.viewportSize === 'mobile' || props.viewportSize === 'tablet')
    : (typeof window !== 'undefined' && window.innerWidth < 1024);

  const {
    imageUrl: directImageUrl,
    backgroundImage,
    mobileImageUrl,
    title,
    subTitle: directSubTitle,
    subtitle: schemaSubtitle,
    description,
    textAlignment = 'left',
    verticalAlignment = 'center',
    fullWidth = true,
    layout = 'background',
    imagePosition = 'right',
    reverseOrder = false,
    overlay,
    buttons: directButtons = [],
    ctaText,
    ctaLink,
    styles: directStyles = {},
    style: nestedStyle = {},
    height: schemaHeight,
    backgroundColor: schemaBackgroundColor,
    template,
    showTitle = true,
    showSubtitle = true,
    showDescription = true,
    imageFit = 'cover',
    imageBorderRadius = 0,
    imagePadding = 0,
    backgroundType = 'image'
  } = props;

  // Map template to layout/position
  let effectiveLayout = props.layout || layout;
  let effectiveImagePosition = props.imagePosition || imagePosition;

  if (template === 'splitRight') {
    effectiveLayout = 'split';
    effectiveImagePosition = 'right';
  } else if (template === 'splitLeft') {
    effectiveLayout = 'split';
    effectiveImagePosition = 'left';
  } else if (template === 'fullWidth') {
    effectiveLayout = 'background';
  }

  const imageUrl = directImageUrl || backgroundImage;
  const subTitle = directSubTitle || schemaSubtitle;
  
  // Create button from CTA props if no buttons provided
  const buttons: ImageBannerConfig['buttons'] = directButtons.length > 0 
    ? directButtons 
    : (ctaText ? [{ label: ctaText, link: ctaLink || '#', style: 'primary', showArrow: true }] : []);

  // Merge legacy flat styles with new nested style structure
  const styles = {
    // 1. Legacy flat styles
    ...directStyles,
    
    // 2. Map new nested style properties (overriding legacy)
    height: nestedStyle.general?.height || directStyles.height || (schemaHeight ? `${schemaHeight}px` : undefined),
    backgroundColor: nestedStyle.general?.backgroundColor || directStyles.backgroundColor || schemaBackgroundColor,
    borderRadius: nestedStyle.general?.borderRadius || directStyles.borderRadius,
    
    titleColor: nestedStyle.title?.color || directStyles.titleColor,
    titleFontSize: nestedStyle.title?.fontSize || directStyles.titleFontSize,
    titleWeight: nestedStyle.title?.fontWeight || directStyles.titleWeight,
    titleFontFamily: nestedStyle.title?.fontFamily || directStyles.titleFontFamily,
    titleLetterSpacing: nestedStyle.title?.letterSpacing || directStyles.titleLetterSpacing,
    titleOpacity: nestedStyle.title?.opacity || directStyles.titleOpacity,
    
    subTitleColor: nestedStyle.subTitle?.color || directStyles.subTitleColor,
    subTitleFontSize: nestedStyle.subTitle?.fontSize || directStyles.subTitleFontSize,
    subTitleFontFamily: nestedStyle.subTitle?.fontFamily || directStyles.subTitleFontFamily,
    subTitleLetterSpacing: nestedStyle.subTitle?.letterSpacing || directStyles.subTitleLetterSpacing,
    
    descriptionColor: nestedStyle.description?.color || directStyles.descriptionColor,
    descriptionFontSize: nestedStyle.description?.fontSize || directStyles.descriptionFontSize,
  };

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

  const buttonStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
    outline: 'border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white',
    'boxed-outline': 'border border-current px-8 py-3 md:px-12 md:py-4 tracking-[0.2em] text-xs md:text-sm hover:bg-current hover:text-white transition-all duration-500 uppercase font-bold'
  };

  const renderContent = () => {
    const content = [
      showSubtitle && subTitle && (
        <p
          key="subtitle"
          className="text-gray-600 text-sm md:text-base mb-4 font-medium tracking-[0.2em] uppercase order-1"
          style={{
            color: styles.subTitleColor,
            fontSize: styles.subTitleFontSize,
            fontFamily: styles.subTitleFontFamily,
            letterSpacing: styles.subTitleLetterSpacing ? `${styles.subTitleLetterSpacing}px` : undefined
          }}
          dangerouslySetInnerHTML={{ __html: subTitle }}
        />
      ),
      showTitle && title && (
        <h1
          key="title"
          className={`text-3xl md:text-7xl lg:text-8xl font-serif-premium font-bold mb-8 leading-[1.2] md:leading-[1.1] ${reverseOrder ? 'order-3' : 'order-2'} ${isMobile ? 'text-white' : 'text-gray-900'}`}
          style={{
            color: isMobile && overlay?.show ? '#ffffff' : styles.titleColor,
            fontSize: isMobile? '2.5rem' : styles.titleFontSize,
            fontWeight: styles.titleWeight,
            fontFamily: styles.titleFontFamily,
            letterSpacing: styles.titleLetterSpacing ? `${styles.titleLetterSpacing}px` : undefined,
            opacity: styles.titleOpacity
          }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      ),
      showDescription && description && description.replace(/<[^>]*>/g, '').trim() !== '' && (
        <p
          key="description"
          className={`text-base md:text-xl mb-10 max-w-xl leading-relaxed ${reverseOrder ? 'order-2' : 'order-3'} ${isMobile ? 'text-white/90' : 'text-gray-800'}`}
          style={{
            color: isMobile && overlay?.show ? '#ffffff' : styles.descriptionColor,
            fontSize: styles.descriptionFontSize
          }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ),
      buttons.length > 0 && (
        <div key="buttons" className="flex flex-wrap gap-4 mt-2 order-4">
          {buttons.map((btn, index) => (
            <StoreLink
              key={index}
              to={btn.link}
              className={`group font-semibold transition-all duration-300 transform hover:scale-[1.02] flex items-center gap-2 ${buttonStyles[btn.style]}`}
              style={{
                backgroundColor: btn.backgroundColor,
                color: btn.textColor,
                borderRadius: btn.borderRadius ? `${btn.borderRadius}px` : (btn.style === 'outline' ? '0.75rem' : '0.75rem'),
                padding: btn.padding || (btn.style === 'primary' ? '1rem 2rem' : '1rem 2rem'),
                justifyContent: btn.contentAlignment || 'center',
                fontFamily: btn.fontFamily || 'inherit',
                fontSize: btn.fontSize ? `${btn.fontSize}px` : 'inherit'
              }}
            >
              {btn.label}
              {btn.showArrow && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
            </StoreLink>
          ))}
        </div>
      )
    ];

    return (
      <div className={`relative z-10 w-full p-6 md:p-20 flex flex-col ${isMobile ? 'items-center text-center' : alignmentClasses[textAlignment]} max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000`}>
        {content}
      </div>
    );
  };

  const renderImage = () => {
    if (backgroundType === 'color' || !imageUrl) return null;
    return (
      <picture className={`${effectiveLayout === 'background' ? 'absolute inset-0' : 'relative w-full h-full'}`}>
      {mobileImageUrl && <source media="(max-width: 768px)" srcSet={mobileImageUrl} />}
      <img
        src={imageUrl}
        alt={typeof title === 'string' ? title.replace(/<[^>]*>/g, '') : 'Banner Image'}
        className="w-full h-full"
        style={{ 
          objectFit: imageFit as any,
          borderRadius: imageBorderRadius ? `${imageBorderRadius}px` : undefined,
          padding: imagePadding ? `${imagePadding}px` : undefined
        }}
      />
    </picture>
    );
  };

  const overlayEl = overlay?.show && (
    <div
      className="absolute inset-0 transition-opacity duration-300 z-[5]"
      style={{
        backgroundColor: overlay.color,
        opacity: overlay.opacity
      }}
    />
  );

  const renderSplit = (position: 'left' | 'right') => {
    const showImage = backgroundType === 'image' && imageUrl;
    
    return (
      <section
        className={`flex flex-col md:flex-row overflow-hidden ${fullWidth ? 'w-full' : 'container mx-auto rounded-3xl my-8 shadow-2xl'}`}
        style={{
          backgroundColor: styles.backgroundColor || '#fcfaf7',
          minHeight:  styles.height || '70vh'
        }}
      >
        {!isMobile && position === 'left' ? (
          <>
            {showImage && (
              <div className="w-full md:w-1/2 relative min-h-[40vh] md:min-h-full overflow-hidden">
                {renderImage()}
                {overlayEl}
              </div>
            )}
            <div className={`w-full ${showImage ? 'md:w-1/2' : 'md:w-full'} flex flex-col ${verticalClasses[verticalAlignment]} p-4 md:p-12 relative`}>
              {renderContent()}
            </div>
          </>
        ) : (
          <>
            <div className={`w-full ${showImage ? 'md:w-1/2' : 'md:w-full'} flex flex-col ${verticalClasses[verticalAlignment]} p-4 md:p-12 relative`}>
              {renderContent()}
            </div>
            {showImage && (
              <div className="w-full md:w-1/2 relative min-h-[40vh] md:min-h-full overflow-hidden">
                {renderImage()}
                {overlayEl}
              </div>
            )}
          </>
        )}
      </section>
    );
  };

  const renderBackgroundView = () => (
    <section
      className={`relative overflow-hidden ${fullWidth ? 'w-full' : 'container mx-auto px-4 rounded-3xl my-8 shadow-2xl'} flex flex-col ${verticalClasses[verticalAlignment]} ${alignmentClasses[textAlignment].split(' ')[0]}`}
      style={{
        backgroundColor: styles.backgroundColor,
        minHeight: isMobile ? '50vh' : (styles.height || '80vh')
      }}
    >
      <div className="absolute inset-0">
        {renderImage()}
        {overlayEl}
      </div>
      {renderContent()}
    </section>
  );

  // On mobile, we always prefer the background view for a premium look (centering content over image)
  if (isMobile) return renderBackgroundView();

  // Return specific template view
  if (template === 'splitLeft') return renderSplit('left');
  if (template === 'splitRight') return renderSplit('right');
  if (template === 'fullWidth' || effectiveLayout === 'background' || !effectiveLayout) return renderBackgroundView();
  
  // Fallback for custom layouts
  if (effectiveLayout === 'split') return renderSplit(effectiveImagePosition as 'left' | 'right');

  return renderBackgroundView();
};

export default ImageBanner;

