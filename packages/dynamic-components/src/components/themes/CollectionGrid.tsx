import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface CollectionItem {
    title: string;
    subtitle?: string;
    imageUrl: string;
    link: string;
    span?: 'small' | 'large' | 'tall' | 'wide';
}

interface CollectionGridProps {
    title?: string;
    items: CollectionItem[];
    styles?: {
        backgroundColor?: string;
        padding?: string;
    };
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ title, items = [], styles = {} }) => {
    const getSpanClass = (span?: string) => {
        switch (span) {
            case 'large': return 'md:col-span-2 md:row-span-2 h-[600px]';
            case 'tall': return 'md:row-span-2 h-[600px]';
            case 'wide': return 'md:col-span-2 h-[300px]';
            default: return 'h-[300px]';
        }
    };

    return (
        <section 
            className="w-full" 
            style={{ backgroundColor: styles.backgroundColor, padding: styles.padding || '6rem 0' }}
        >
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
                {title && (
                    <div className="flex flex-col items-center mb-16 text-center">
                        <h2 className="text-3xl md:text-5xl font-serif tracking-tight mb-4">{title}</h2>
                        <div className="w-12 h-[1px] bg-primary/30" />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
                    {items.map((item, idx) => (
                        <motion.a
                            key={idx}
                            href={item.link}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className={`relative group overflow-hidden bg-gray-100 rounded-[2rem] ${getSpanClass(item.span)}`}
                        >
                            <img 
                                src={item.imageUrl} 
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                            
                            <div className="absolute inset-x-8 bottom-8 flex justify-between items-end">
                                <div className="space-y-1">
                                    {item.subtitle && (
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-2 font-bold">{item.subtitle}</p>
                                    )}
                                    <h3 className="text-2xl md:text-3xl font-serif text-white tracking-tight">{item.title}</h3>
                                </div>
                                <div className="p-3 bg-white text-black rounded-full transition-transform duration-500 group-hover:rotate-45">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CollectionGrid;
