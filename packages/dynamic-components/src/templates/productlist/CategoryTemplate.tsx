import { motion } from 'framer-motion';

const CategoryTemplate = ({ data, styles }: any) => {
    const {
        imageShape = 'circle',
        aspectRatio = '1/1',
        textAlign = 'center',
        titleColor = '#111827',
        subtitleColor = '#6b7280',
        showShadow = true
    } = styles;

    const shapeClasses: any = {
        circle: 'rounded-full',
        square: 'rounded-none',
        rounded: 'rounded-[1.5rem]'
    };

    const alignmentClasses: any = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end'
    };

    return (
        <a 
            href={data.link || '#'}
            className={`flex flex-col ${alignmentClasses[textAlign]} group cursor-pointer`}
        >
            <div
                className={`relative overflow-hidden mb-6 ${shapeClasses[imageShape]} transition-all duration-500 ring-0 ring-primary/0 group-hover:ring-[6px] group-hover:ring-primary/5`}
                style={{
                    aspectRatio,
                    width: '100%',
                    boxShadow: showShadow ? '0 20px 40px -15px rgba(0, 0, 0, 0.08)' : 'none'
                }}
            >
                <motion.img
                    src={data.imageUrl || data.image || '/placeholder-category.jpg'}
                    alt={data.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                />
                
                {/* Overlay for depth */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            <div className="space-y-1">
                <h3
                    className="text-sm md:text-base font-bold uppercase tracking-[0.15em] transition-colors duration-300 group-hover:text-primary"
                    style={{ color: titleColor }}
                >
                    {data.title}
                </h3>
                {data.subtitle && (
                    <p
                        className="text-xs md:text-sm opacity-50 font-light"
                        style={{ color: subtitleColor }}
                    >
                        {data.subtitle}
                    </p>
                )}
            </div>
        </a>
    );
};

export default CategoryTemplate;
