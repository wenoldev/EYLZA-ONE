import { ArrowRight } from 'lucide-react';
import { StoreLink } from '../components/theme-support/StoreLink';

export const CategoryCard1 = ({ data, styles }: any) => {
    const {
        imageShape = 'rounded',
        textAlign = 'center',
        titleColor = '#111827',
        subtitleColor = '#6b7280',
        aspectRatio = '1/1'
    } = styles;

    const shapeClasses: any = {
        circle: 'rounded-full',
        square: 'rounded-none',
        rounded: 'rounded-2xl'
    };

    const alignmentClasses: any = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end'
    };

    return (
        <StoreLink 
            to={data.link || data.href || '#'}
            className={`flex flex-col ${alignmentClasses[textAlign]} group cursor-pointer w-full`}
        >
            <div
                className={`relative overflow-hidden mb-4 ${shapeClasses[imageShape]} transition-all duration-500`}
                style={{
                    aspectRatio,
                    width: '100%',
                }}
            >
                <img
                    src={data.imageUrl || data.image || '/placeholder-category.jpg'}
                    alt={data.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
            </div>
            
            <div className="space-y-1">
                <h3
                    className="text-lg font-bold tracking-tight"
                    style={{ color: titleColor }}
                >
                    {data.title}
                </h3>
                {data.subtitle && (
                    <p
                        className="text-sm opacity-60"
                        style={{ color: subtitleColor }}
                    >
                        {data.subtitle}
                    </p>
                )}
            </div>
        </StoreLink>
    );
};

export const CategoryCard2 = ({ data, styles }: any) => {
    const {
        titleColor = '#ffffff',
        subtitleColor = '#ffffff',
        aspectRatio = '1/1'
    } = styles;

    return (
        <StoreLink 
            to={data.link || data.href || '#'}
            className="relative overflow-hidden group rounded-3xl cursor-pointer w-full"
            style={{ aspectRatio }}
        >
            <img
                src={data.imageUrl || data.image || '/placeholder-category.jpg'}
                alt={data.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {data.subtitle && (
                        <p
                            className="text-[10px] uppercase font-bold tracking-[0.2em] mb-2"
                            style={{ color: subtitleColor, opacity: 0.7 }}
                        >
                            {data.subtitle}
                        </p>
                    )}
                    <div className="flex items-center justify-between gap-4">
                        <h3
                            className="text-2xl font-serif tracking-tight"
                            style={{ color: titleColor }}
                        >
                            {data.title}
                        </h3>
                        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                            <ArrowRight size={18} />
                        </div>
                    </div>
                </div>
            </div>
        </StoreLink>
    );
};
