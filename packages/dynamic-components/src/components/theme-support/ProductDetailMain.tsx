import React, { useState } from 'react';
import type { ProductDetailConfig } from '../../types/ProductDetail';
import { Star, Share2, Heart, Plus, Minus, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { cn } from '../../libs/utils';

interface ProductDetailProps {
    config: ProductDetailConfig;
}

export const ProductDetailMain: React.FC<ProductDetailProps> = ({ config }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    // Default values
    const layout = config.layout ?? 'split';
    const gallery = {
        position: config.gallery?.position ?? 'left',
        showThumbnails: config.gallery?.showThumbnails ?? true,
        aspectRatio: config.gallery?.aspectRatio ?? '4/5',
        imageShape: config.gallery?.imageShape ?? 'rounded'
    };
    const content = {
        showRating: config.content?.showRating ?? true,
        showSku: config.content?.showSku ?? false,
        showStock: config.content?.showStock ?? true,
        showShareButtons: config.content?.showShareButtons ?? true,
        stickyInfo: config.content?.stickyInfo ?? true
    };
    const styles = {
        backgroundColor: config.styles?.backgroundColor ?? 'transparent',
        paddingTop: config.styles?.paddingTop ?? 60,
        paddingBottom: config.styles?.paddingBottom ?? 60,
        containerWidth: config.styles?.containerWidth ?? 1280,
        titleColor: config.styles?.titleColor ?? '#111827',
        titleSize: config.styles?.titleSize ?? 32,
        priceColor: config.styles?.priceColor ?? '#111827',
        salePriceColor: config.styles?.salePriceColor ?? '#ef4444',
        buttonColor: config.styles?.buttonColor ?? '#000000',
        buttonTextColor: config.styles?.buttonTextColor ?? '#ffffff',
        buttonText: config.styles?.buttonText ?? 'Add to Cart',
        buttonShape: config.styles?.buttonShape ?? 'rounded'
    };

    const product = {
        name: "Premium Cotton Essential Tee",
        price: 49.00,
        salePrice: 39.00,
        rating: 4.8,
        reviews: 124,
        sku: "EYL-TEE-001",
        stock: "In Stock",
        description: "Our signature Essential Tee is crafted from 100% organic long-staple cotton. Featuring a refined fit, reinforced neckband, and a buttery-soft finish that gets better with every wash.",
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop"
        ],
        variants: [
            { name: "White", color: "#ffffff" },
            { name: "Black", color: "#000000" },
            { name: "Navy", color: "#1e3a8a" },
            { name: "Sand", color: "#d2b48c" }
        ],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"]
    };

    const radiusClass = gallery.imageShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';
    const buttonRadius = styles.buttonShape === 'pill' ? 'rounded-full' : styles.buttonShape === 'rounded' ? 'rounded-lg' : 'rounded-none';

    return (
        <div style={{ backgroundColor: styles.backgroundColor, paddingTop: styles.paddingTop, paddingBottom: styles.paddingBottom }}>
            <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: styles.containerWidth }}>
                <div className={cn(
                    "grid gap-12",
                    layout === 'split' ? "lg:grid-cols-2" : "grid-cols-1"
                )}>
                    {/* Gallery Section */}
                    <div className={cn(
                        "flex gap-4",
                        gallery.position === 'top' ? "flex-col-reverse" :
                            gallery.position === 'right' ? "lg:order-last flex-row" : "flex-col lg:flex-row"
                    )}>
                        {/* Thumbnails */}
                        {gallery.showThumbnails && (
                            <div className={cn(
                                "flex gap-3 shrink-0",
                                gallery.position === 'top' ? "flex-row overflow-x-auto" : "flex-row lg:flex-col overflow-y-auto lg:max-h-[600px]"
                            )}>
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={cn(
                                            "relative w-20 aspect-[4/5] bg-muted overflow-hidden transition-all border-2",
                                            selectedImage === i ? "border-black" : "border-transparent",
                                            radiusClass
                                        )}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Image */}
                        <div className={cn(
                            "relative flex-1 bg-muted overflow-hidden group",
                            radiusClass
                        )} style={{ aspectRatio: gallery.aspectRatio }}>
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <button className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Product Info Section */}
                    <div className={cn(
                        "flex flex-col",
                        content.stickyInfo && "lg:sticky lg:top-24 h-fit"
                    )}>
                        {/* Header Content */}
                        <div className="space-y-4">
                            {content.showStock && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {product.stock}
                                </span>
                            )}

                            <h1
                                className="font-bold tracking-tight"
                                style={{ color: styles.titleColor, fontSize: styles.titleSize }}
                            >
                                {product.name}
                            </h1>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-bold" style={{ color: styles.salePriceColor }}>${product.salePrice}</span>
                                        <span className="text-xl text-muted-foreground line-through">${product.price}</span>
                                    </div>
                                </div>

                                {content.showShareButtons && (
                                    <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {content.showRating && (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className={cn("w-4 h-4 fill-current", s <= Math.floor(product.rating) ? "text-yellow-400" : "text-gray-200")} />
                                        ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground font-medium">
                                        {product.rating} ({product.reviews} reviews)
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 space-y-8">
                            {/* Description */}
                            <p className="text-base text-muted-foreground leading-relaxed">
                                {product.description}
                            </p>

                            {/* Variant Selectors Placeholder */}
                            <div className="space-y-6 pt-6 border-t border-border">
                                {/* Colors */}
                                <div className="space-y-3">
                                    <span className="text-sm font-bold uppercase tracking-wider text-foreground">Color:</span>
                                    <div className="flex gap-3">
                                        {product.variants.map((v) => (
                                            <button
                                                key={v.name}
                                                className="w-10 h-10 rounded-full border-2 border-transparent hover:border-black p-0.5 transition-all"
                                                title={v.name}
                                            >
                                                <div className="w-full h-full rounded-full border border-black/10" style={{ backgroundColor: v.color }} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sizes */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold uppercase tracking-wider text-foreground">Size:</span>
                                        <button className="text-xs font-semibold underline text-muted-foreground hover:text-foreground">Size Guide</button>
                                    </div>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                        {product.sizes.map((s) => (
                                            <button
                                                key={s}
                                                className="h-10 border border-border rounded-md text-sm font-medium hover:border-black transition-colors"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Buy Actions */}
                            <div className="space-y-4 pt-4">
                                <div className="flex gap-4">
                                    {/* Quantity */}
                                    <div className="flex items-center border border-border rounded-lg h-14 px-2">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-muted-foreground hover:text-foreground">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-muted-foreground hover:text-foreground">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Add to Cart */}
                                    <button
                                        className={cn(
                                            "flex-1 h-14 text-base font-bold flex items-center justify-center gap-3 shadow-lg shadow-black/5 hover:scale-[1.01] transition-all",
                                            buttonRadius
                                        )}
                                        style={{ backgroundColor: styles.buttonColor, color: styles.buttonTextColor }}
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        {styles.buttonText}
                                    </button>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                                    <Truck className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-xs font-semibold leading-tight">Free Express Shipping</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                                    <RotateCcw className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-xs font-semibold leading-tight">30-Day Easy Returns</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                                    <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-xs font-semibold leading-tight">2-Year Warranty</span>
                                </div>
                            </div>

                            {content.showSku && (
                                <div className="pt-6 border-t border-border">
                                    <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
