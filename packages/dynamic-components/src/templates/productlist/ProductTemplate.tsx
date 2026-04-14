import React from 'react';
import { StoreLink } from '../../components/theme-support/StoreLink';

const ProductTemplate = ({ data, styles }: any) => {
  const {
    imageShape = 'rounded',
    aspectRatio = '1/1',
    textAlign = 'left',
    titleColor = '#111827',
    backgroundColor = 'white',
    padding = '1rem',
    showShadow = false
  } = styles;

  const shapeClasses: any = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-xl'
  };

  const alignmentClasses: any = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  return (
    <StoreLink
      to={data.href || '#'}
      className={`flex flex-col ${alignmentClasses[textAlign]} group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer`}
      style={{
        backgroundColor,
        padding,
        boxShadow: showShadow ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' : 'none'
      }}
    >
      <div
        className={`relative overflow-hidden mb-4 ${shapeClasses[imageShape]}`}
        style={{ aspectRatio, width: '100%' }}
      >
        <img
          src={data.imageUrl || data.image}
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <h3
        className="text-base font-semibold mb-2 line-clamp-2"
        style={{ color: titleColor }}
        dangerouslySetInnerHTML={{ __html: data.title }}
      />
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg font-bold text-blue-600">{data.price || data.subtitle}</span>
        {data.oldPrice && (
          <span className="text-sm text-gray-400 line-through">{data.oldPrice}</span>
        )}
      </div>
      <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors">
        Add to Cart
      </button>
    </StoreLink>
  );
};

export default ProductTemplate;
