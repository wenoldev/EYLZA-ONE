import React, { useMemo, useState } from 'react';
import type { ProductDetailConfig } from '../../types/ProductDetail';
import {
    ChevronDown,
    Heart,
    Minus,
    Plus,
    Share2,
    ShieldCheck,
    ShoppingBag,
    Star,
    Truck
} from 'lucide-react';
import { cn } from '../../libs/utils';
import { getBridge, isEditorRuntime } from '../../utils/runtime';

interface ProductDetailProps {
    config: ProductDetailConfig;
}

const DEFAULT_PRODUCT = {
    id: 'hidden-message-curved-bar-bracelet',
    name: 'Hidden Message Curved Bar Bracelet',
    price: 1299,
    originalPrice: 1699,
    badge: 'Sale',
    label: 'ZARISHKA',
    reviewCount: 2,
    rating: 5,
    stockText: '0 Sold in last 1 hour',
    description:
        "Sleek. Minimal. Meaningful.\n\nThis isn't just a bracelet - it's your story, discreetly engraved and worn close every day. Crafted from premium 316L grade stainless steel, our Personalised Hidden Message Bracelet combines timeless design with lasting durability.",
    images: [
        'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1611652022440-4f8fdd9874a3?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80'
    ],
    options: [
        {
            label: 'Enter Your Message',
            values: ['Type your message']
        },
        {
            label: 'Colour',
            values: ['Silver', 'Timeless Gold', 'Romantic Rose Gold']
        }
    ],
    metadata: [
        { label: 'Chain Length', value: '40+5cm' },
        { label: 'Material', value: '316 L Medical grade stainless steel' },
        { label: 'Crafted For', value: 'Everyday wear and gifting' }
    ]
};

const DEFAULT_FAQS = [
    { title: 'Do You Offer Cash on Delivery?', content: 'Yes. COD is available on eligible orders and serviceable pincodes.' },
    { title: 'Can I use it daily?', content: 'Yes. It is designed for regular wear with a durable stainless steel base.' },
    { title: 'How can I Return/Replace the product?', content: 'You can request a return or replacement through support within the applicable policy window.' },
    { title: 'How to get the tracking details?', content: 'Tracking details are shared by email and SMS once the order ships.' }
];

const DEFAULT_REVIEWS = [
    {
        author: 'Litha T.',
        meta: 'Verified',
        body: 'Excellent service and the bracelet feels premium in hand.',
        rating: 5
    },
    {
        author: 'Sarah Q.',
        meta: 'Verified',
        body: 'It is super cute and looks very pretty on my mum’s hand.',
        rating: 5
    }
];

const formatPrice = (value?: number) => {
    if (typeof value !== 'number') return '';
    return `Rs. ${new Intl.NumberFormat('en-IN').format(value)}.00`;
};

export const ProductDetailMain: React.FC<ProductDetailProps> = ({ config }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [message, setMessage] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const editorMode = isEditorRuntime();
    const bridge = getBridge();

    const product = useMemo(() => ({
        ...DEFAULT_PRODUCT,
        ...config.product,
        images: config.product?.images?.length ? config.product.images : DEFAULT_PRODUCT.images,
        options: config.product?.options?.length ? config.product.options : DEFAULT_PRODUCT.options,
        metadata: config.product?.metadata?.length ? config.product.metadata : DEFAULT_PRODUCT.metadata
    }), [config.product]);

    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
        (product.options || []).reduce<Record<string, string>>((acc, option) => {
            if (option.values?.[0] && option.label !== 'Enter Your Message') {
                acc[option.label] = option.values[0];
            }
            return acc;
        }, {})
    );

    const handleAddToCart = () => {
        if (editorMode || typeof bridge.addToCart !== 'function') return;

        bridge.addToCart(
            {
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.images?.[selectedImage] || product.images?.[0]
            },
            quantity,
            {
                ...selectedOptions,
                ...(message ? { Message: message } : {})
            }
        );
    };

    const layout = config.layout ?? 'split';
    const gallery = {
        position: config.gallery?.position ?? 'left',
        showThumbnails: config.gallery?.showThumbnails ?? true,
        aspectRatio: config.gallery?.aspectRatio ?? '4/5',
        imageShape: config.gallery?.imageShape ?? 'square'
    };
    const styles = {
        backgroundColor: config.styles?.backgroundColor ?? '#ffffff',
        paddingTop: config.styles?.paddingTop ?? 48,
        paddingBottom: config.styles?.paddingBottom ?? 80,
        containerWidth: config.styles?.containerWidth ?? 1280,
        titleColor: config.styles?.titleColor ?? '#1f1a17',
        titleSize: config.styles?.titleSize ?? 50,
        priceColor: config.styles?.priceColor ?? '#1f1a17',
        salePriceColor: config.styles?.salePriceColor ?? '#1f1a17',
        buttonColor: config.styles?.buttonColor ?? '#ffffff',
        buttonTextColor: config.styles?.buttonTextColor ?? '#1f1a17',
        buttonText: config.styles?.buttonText ?? 'Add to cart',
        buttonShape: config.styles?.buttonShape ?? 'square'
    };

    if (config.template === 'zarishka') {
        return (
            <div style={{ backgroundColor: styles.backgroundColor }} className="py-8 md:py-16 overflow-x-hidden w-full">
                <div 
                  className="mx-auto px-4 md:px-8 w-full max-w-full" 
                  style={{ 
                    maxWidth: styles.containerWidth,
                    paddingTop: typeof styles.paddingTop === 'number' ? Math.min(styles.paddingTop, 32) : styles.paddingTop,
                    paddingBottom: typeof styles.paddingBottom === 'number' ? Math.min(styles.paddingBottom, 40) : styles.paddingBottom
                  }}
                >
                    <div className={cn('grid gap-8 md:gap-10 lg:gap-14 xl:gap-20 w-full', layout === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1')}>
                        <div className="lg:sticky lg:top-24 h-fit">
                            <div
                                className="overflow-hidden bg-[#f4efe8] rounded-2xl shadow-sm"
                                style={{ aspectRatio: gallery.aspectRatio }}
                            >
                                <img
                                    src={product.images?.[selectedImage]}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-opacity duration-500"
                                />
                            </div>

                            {gallery.showThumbnails && (
                                <div className="mt-6 flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                    {product.images?.map((image, index) => (
                                        <button
                                            key={image}
                                            type="button"
                                            onClick={() => setSelectedImage(index)}
                                            className={cn(
                                                'h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all',
                                                selectedImage === index ? 'border-[#1f1a17] shadow-md' : 'border-[#d8d2c7] opacity-60 hover:opacity-100'
                                            )}
                                        >
                                            <img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <p className="text-[10px] tracking-[0.25em] text-[#8f8667] uppercase">{product.label}</p>
                                <h1
                                    className="font-serif leading-[1.05] text-3xl md:text-4xl lg:text-5xl"
                                    style={{ color: styles.titleColor }}
                                >
                                    {product.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-[#3d352d]">
                                    <span className="line-through opacity-45 shrink-0">{formatPrice(product.originalPrice)}</span>
                                    <span style={{ color: styles.salePriceColor }} className="shrink-0">{formatPrice(product.price)}</span>
                                    {product.badge && (
                                        <span className="rounded-full bg-[#b8b277] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white shrink-0">
                                            {product.badge}
                                        </span>
                                    )}
                                </div>
                                {product.stockText && <p className="text-xs text-[#8f8667]">{product.stockText}</p>}
                                <div className="flex items-center gap-2 text-[#1f1a17]">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <Star key={index} className="h-4 w-4 fill-current" />
                                    ))}
                                    <span className="text-xs">({product.reviewCount || 0})</span>
                                </div>
                            </div>

                            <div className="space-y-5 border-t border-[#e7e1d7] pt-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-[#3d352d]">
                                        {product.options?.[0]?.label || 'Enter Your Message'}
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={(event) => setMessage(event.target.value)}
                                        disabled={editorMode}
                                        className="min-h-24 w-full border border-[#ddd6c8] bg-white px-3 py-3 text-sm outline-none transition-colors focus:border-[#8f8667] disabled:cursor-not-allowed disabled:bg-[#f5f2ea]"
                                        maxLength={25}
                                    />
                                    <p className="text-right text-[10px] text-[#8f8667]">{message.length}/25</p>
                                </div>

                                {product.options?.slice(1).map((option) => (
                                    <div key={option.label} className="space-y-2">
                                        <label className="text-xs font-medium text-[#3d352d]">{option.label}</label>
                                        <select
                                            value={selectedOptions[option.label]}
                                            onChange={(event) => setSelectedOptions((prev) => ({ ...prev, [option.label]: event.target.value }))}
                                            disabled={editorMode}
                                            className="h-11 w-full border border-[#ddd6c8] bg-white px-3 text-sm outline-none focus:border-[#8f8667] disabled:cursor-not-allowed disabled:bg-[#f5f2ea]"
                                        >
                                            {option.values.map((value) => (
                                                <option key={value} value={value}>
                                                    {value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}

                                <div className="space-y-3">
                                    <label className="text-xs font-medium text-[#3d352d]">Quantity</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-11 items-center border border-[#ddd6c8]">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                                disabled={editorMode}
                                                className="px-3 text-[#6f6758] disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-12 text-center text-sm">{quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((prev) => prev + 1)}
                                                disabled={editorMode}
                                                className="px-3 text-[#6f6758] disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        disabled={editorMode}
                                        className="relative flex min-h-[3rem] md:min-h-[3.5rem] w-full items-center justify-center gap-3 border-2 border-[#1f1a17] bg-transparent px-4 md:px-8 py-3 md:py-4 text-[10px] md:text-sm font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all hover:bg-[#1f1a17] hover:text-white disabled:cursor-not-allowed disabled:border-[#c8c0b4] disabled:text-[#aaa18f]"
                                        style={{ borderRadius: styles.buttonShape === 'pill' ? 9999 : 0 }}
                                    >
                                        <ShoppingBag className="h-4 md:h-5 w-4 md:w-5" />
                                        {editorMode ? 'Editor Preview' : styles.buttonText}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        disabled={editorMode}
                                        className="flex min-h-[3rem] md:min-h-[3.5rem] w-full items-center justify-center bg-[#1f1a17] px-4 md:px-8 py-3 md:py-4 text-[10px] md:text-sm font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-white shadow-lg transition-all hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d2c3]"
                                        style={{ borderRadius: styles.buttonShape === 'pill' ? 9999 : 0 }}
                                    >
                                        Buy it now
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-5 border-t border-[#e7e1d7] pt-6 text-sm leading-7 text-[#574e43]">
                                {product.description?.split('\n\n').map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                                <div className="grid gap-4 border-t border-[#efe9de] pt-5 sm:grid-cols-2">
                                    {(product.metadata || []).map((item) => (
                                        <div key={item.label} className="break-words">
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8f8667]">{item.label}</p>
                                            <p className="break-words">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid gap-3 border-t border-[#efe9de] pt-5 text-xs text-[#6f6758] sm:grid-cols-2">
                                    <div className="flex items-center gap-3"><Truck className="h-4 w-4" /> Delivery Time</div>
                                    <div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4" /> Zarishka Warranty</div>
                                    <div className="flex items-center gap-3"><Share2 className="h-4 w-4" /> Share</div>
                                    <div className="flex items-center gap-3"><Heart className="h-4 w-4" /> Save for later</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 md:mt-20 grid gap-10 md:gap-14 lg:grid-cols-[0.8fr_1.2fr] w-full overflow-hidden">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[#1f1a17]">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Star key={index} className="h-4 w-4 fill-current" />
                                ))}
                                <span className="text-xs">{(config.reviewItems || DEFAULT_REVIEWS).length} Reviews</span>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                {(config.reviewItems || DEFAULT_REVIEWS).map((review) => (
                                    <article key={review.author} className="border border-[#ece5d7] bg-white p-4">
                                        <div className="mb-3 flex items-center gap-1 text-[#1f1a17]">
                                            {Array.from({ length: review.rating || 5 }).map((_, index) => (
                                                <Star key={index} className="h-3.5 w-3.5 fill-current" />
                                            ))}
                                        </div>
                                        <p className="text-sm font-medium text-[#1f1a17]">{review.author}</p>
                                        {review.meta && <p className="text-[10px] uppercase tracking-[0.18em] text-[#8f8667]">{review.meta}</p>}
                                        <p className="mt-3 text-sm leading-6 text-[#5d564c]">{review.body}</p>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="mb-6 text-center font-serif text-4xl text-[#1f1a17]">FAQ&apos;s</h2>
                            <div className="border-t border-[#e7e1d7]">
                                {(config.faqItems || DEFAULT_FAQS).map((item, index) => {
                                    const isOpen = openFaq === index;

                                    return (
                                        <div key={item.title} className="border-b border-[#e7e1d7]">
                                            <button
                                                type="button"
                                                onClick={() => setOpenFaq(isOpen ? null : index)}
                                                className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm text-[#3d352d]"
                                            >
                                                <span>{item.title}</span>
                                                <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
                                            </button>
                                            {isOpen && <p className="pb-4 pr-6 text-sm leading-6 text-[#6f6758]">{item.content}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: styles.backgroundColor, paddingTop: styles.paddingTop, paddingBottom: styles.paddingBottom }} className="overflow-x-hidden w-full">
            <div className="mx-auto grid gap-10 px-4 lg:grid-cols-2 w-full max-w-full" style={{ maxWidth: styles.containerWidth }}>
                <div
                    className={cn(
                        'overflow-hidden bg-[#f4efe8]',
                        gallery.imageShape === 'rounded' ? 'rounded-3xl' : 'rounded-none'
                    )}
                    style={{ aspectRatio: gallery.aspectRatio }}
                >
                    <img src={product.images?.[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-6">
                    <h1 className="font-serif text-4xl" style={{ color: styles.titleColor }}>{product.name}</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-semibold" style={{ color: styles.salePriceColor }}>{formatPrice(product.price)}</span>
                        {product.originalPrice && <span className="text-lg text-[#8f8667] line-through">{formatPrice(product.originalPrice)}</span>}
                    </div>
                    <p className="text-sm leading-7 text-[#574e43]">{product.description}</p>
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={editorMode}
                        className="inline-flex h-12 items-center justify-center gap-2 bg-[#1f1a17] px-6 text-sm uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:bg-[#c8c0b4]"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        {editorMode ? 'Editor Preview' : styles.buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};
