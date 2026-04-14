import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useStore } from '@/store/useStore';
import { useUIStore } from '@/store/useUIStore';
import { 
    Star, 
    ShoppingBag, 
    Heart, 
    Share2, 
    ShieldCheck, 
    Truck, 
    ArrowLeft, 
    Minus, 
    Plus,
    CheckCircle2
} from 'lucide-react';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams();
    const { addItem } = useCartStore();
    const { openCart } = useUIStore();
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({
        'Material': '18K Gold',
        'Size': 'Medium'
    });

    useEffect(() => {
        // Mock fetching product details
        setIsLoading(true);
        setTimeout(() => {
            const mockProduct = {
                id: productId || '1',
                name: 'Handcrafted Birthstone Necklace',
                price: 4999,
                original_price: 5999,
                description: 'A beautiful handcrafted necklace featuring a genuine birthstone of your choice. Set in high-quality 18K gold-plated silver, this piece is designed to be a timeless addition to your collection.',
                images: [
                    '/images/jewelry-1.jpg',
                    '/images/jewelry-2.jpg',
                    '/images/jewelry-3.jpg',
                ],
                category: 'Necklaces',
                rating: 4.8,
                reviewsCount: 124,
                features: [
                    'Handmade in Mumbai',
                    'Ethically sourced gemstones',
                    'Tarnish-resistant finish',
                    'Includes premium packaging'
                ]
            };
            setProduct(mockProduct);
            setIsLoading(false);
        }, 800);
    }, [productId]);

    const handleAddToCart = () => {
        if (!product) return;
        addItem(product, quantity, selectedAttributes);
        openCart();
    };

    if (isLoading) return (
        <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-accent aspect-square rounded-3xl" />
                <div className="space-y-6">
                    <div className="h-4 bg-accent rounded w-1/4" />
                    <div className="h-10 bg-accent rounded w-3/4" />
                    <div className="h-4 bg-accent rounded w-full" />
                    <div className="h-4 bg-accent rounded w-full" />
                    <div className="h-20 bg-accent rounded w-full" />
                </div>
            </div>
        </div>
    );

    if (!product) return <div className="py-20 text-center">Product not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb / Back */}
            <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10 group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Collection
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">
                {/* Image Gallery */}
                <div className="space-y-6">
                    <div className="aspect-[4/5] bg-accent rounded-3xl overflow-hidden border border-border/50 shadow-sm relative group">
                        <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-6 right-6 flex flex-col gap-3">
                            <button className="p-3 bg-white/80 backdrop-blur-xl rounded-full text-muted-foreground hover:text-destructive hover:bg-white transition-all shadow-lg">
                                <Heart className="w-5 h-5" />
                            </button>
                            <button className="p-3 bg-white/80 backdrop-blur-xl rounded-full text-muted-foreground hover:text-primary hover:bg-white transition-all shadow-lg">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                        {product.images.map((img: string, idx: number) => (
                            <div key={idx} className="aspect-square bg-accent rounded-2xl overflow-hidden border border-border/50 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                                <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                    <div className="pb-8 border-b border-border mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] bg-primary/10 px-2 py-0.5 rounded">
                                {product.category}
                            </span>
                            <div className="flex items-center gap-1.5 text-amber-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-bold text-foreground">{product.rating}</span>
                                <span className="text-xs text-muted-foreground">({product.reviewsCount} Reviews)</span>
                            </div>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-serif font-bold italic mb-6 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-3xl font-serif font-bold italic text-primary">₹ {product.price.toLocaleString()}</span>
                            {product.original_price && (
                                <span className="text-lg text-muted-foreground line-through opacity-50 italic">
                                    ₹ {product.original_price.toLocaleString()}
                                </span>
                            )}
                        </div>

                        <p className="text-muted-foreground text-lg leading-relaxed mb-8 italic">
                            {product.description}
                        </p>
                    </div>

                    {/* Options (Mocked) */}
                    <div className="space-y-8 mb-10">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-4">Select Material</span>
                            <div className="flex gap-4">
                                {['18K Gold', 'Rose Gold', 'Silver'].map((mat) => (
                                    <button 
                                        key={mat}
                                        onClick={() => setSelectedAttributes(prev => ({ ...prev, 'Material': mat }))}
                                        className={`px-6 py-3 rounded-full text-sm font-bold transition-all border ${selectedAttributes['Material'] === mat ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-transparent border-border text-muted-foreground hover:border-primary'}`}
                                    >
                                        {mat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-8">
                            <div className="space-y-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">Quantity</span>
                                <div className="flex items-center border border-border rounded-full p-1 bg-accent/30 self-start">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full transition-colors disabled:opacity-30"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-bold tabular-nums">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex-1 min-w-[200px] flex flex-col justify-end">
                                <button 
                                    onClick={handleAddToCart}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 group transition-all shadow-xl shadow-primary/20 text-lg"
                                >
                                    <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Trust Signals */}
                    <div className="grid grid-cols-2 gap-6 pt-10 border-t border-border">
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white shadow-sm border border-primary/10">
                                <Truck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold italic">Free Shipping</h4>
                                <p className="text-xs text-muted-foreground">On all orders above ₹2000</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white shadow-sm border border-primary/10">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold italic">7-Day Return</h4>
                                <p className="text-xs text-muted-foreground">Hassle-free exchange policy</p>
                            </div>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="mt-12 space-y-3">
                        {product.features.map((feature: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
