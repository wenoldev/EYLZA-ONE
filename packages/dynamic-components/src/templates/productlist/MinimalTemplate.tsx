import React from 'react';
import { StoreLink } from '../../components/theme-support/StoreLink';

const MinimalTemplate = ({ data, styles }: any) => {
  const {
    textAlign = 'left',
    titleColor = '#111827'
  } = styles;

  const alignmentClasses: any = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  return (
    <StoreLink to={data.href || '#'} className={`flex flex-col ${alignmentClasses[textAlign]} group cursor-pointer`}>
      <img
        src={data.imageUrl || data.image}
        alt={data.title}
        className="w-full h-auto rounded-lg mb-3 grayscale hover:grayscale-0 transition-all duration-500"
      />
      <h3
        className="text-sm font-medium"
        style={{ color: titleColor }}
        dangerouslySetInnerHTML={{ __html: data.title }}
      />
    </StoreLink>
  );
};

export default MinimalTemplate;
