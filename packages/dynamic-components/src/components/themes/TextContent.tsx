import React from 'react';
import type { TextContentConfig } from '../../types/TextContent';

const TextContent: React.FC<TextContentConfig> = (config) => {
  const {
    title,
    content,
    alignment = 'center',
    styles = {}
  } = config;

  const {
    backgroundColor = 'transparent',
    textColor = '#4b5563',
    titleColor = '#111827',
    fontFamily = 'sans',
    maxWidth = '800px',
    padding = '4rem 1rem'
  } = styles;

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  return (
    <section
      className="w-full"
      style={{ backgroundColor }}
    >
      <div
        className={`container mx-auto flex flex-col ${alignmentClasses[alignment]}`}
        style={{ padding, maxWidth }}
      >
        {title && (
          <h2
            className={`text-3xl md:text-4xl font-bold mb-8 ${fontFamily === 'serif' ? 'font-serif-premium' : ''}`}
            style={{ color: titleColor }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
        {content && (
          <div
            className={`text-lg leading-relaxed ${fontFamily === 'serif' ? 'font-serif-premium' : ''}`}
            style={{ color: textColor }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </section>
  );
};

export default TextContent;
