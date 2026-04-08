import React from 'react';

const ZarishkaTemplate = ({ data, styles }: any) => {
    const {
        aspectRatio = '1/1',
        textAlign = 'center',
        padding = '0',
    } = styles || {};

    const isSale = data.oldPrice && data.price !== data.oldPrice;
    const isSoldOut = data.soldOut;

    return (
        <div 
            className="flex flex-col group cursor-pointer"
            style={{ padding }}
        >
            {/* Image Container */}
            <div 
                className="relative overflow-hidden mb-4 bg-[#f2f2f2]"
                style={{ aspectRatio, width: '100%' }}
            >
                <img
                    src={data.imageUrl || data.image}
                    alt={data.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Badges */}
                {isSale && !isSoldOut && (
                    <div className="absolute top-3 left-3 bg-[#a3a380] text-white text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm">
                        Sale
                    </div>
                )}
                {isSoldOut && (
                    <div className="absolute top-3 left-3 bg-[#444] text-white text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm">
                        Sold out
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className={`flex flex-col ${textAlign === 'center' ? 'items-center' : textAlign === 'right' ? 'items-end' : 'items-start'}`}>
                <h3 
                    className="text-[13px] uppercase tracking-[0.15em] mb-1 font-medium text-[#1a1a1a] line-clamp-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    {data.title}
                </h3>
                
                <div className="flex gap-2 items-center">
                    {isSale && (
                        <span className="text-[12px] text-[#888] line-through font-light">
                            {data.oldPrice}
                        </span>
                    )}
                    <span className={`text-[13px] font-medium ${isSale ? 'text-[#8b0000]' : 'text-[#1a1a1a]'}`}>
                        {data.price || data.subtitle}
                    </span>
                </div>

                {data.variants && (
                    <span className="text-[11px] text-[#666] mt-1 font-light italic">
                        From {data.price}
                    </span>
                )}
            </div>

            {/* Subtle Hover Effect CSS */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
            `}</style>
        </div>
    );
};

export default ZarishkaTemplate;
