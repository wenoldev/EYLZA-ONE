import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Plus, ArrowRight, Minus } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';

const AurelianProductDetail: React.FC = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { storeSlug } = useParams();
    const { addItem } = useCartStore();
    const { toggleCart } = useUIStore();
    
    const [selectedFinish, setSelectedFinish] = useState('gold');
    const [customMessage, setCustomMessage] = useState('');

    // Mock product data based on stitch file
    const product = {
        id: productId || '1',
        name: "Hidden Message Curved Bar Bracelet",
        price: 420.00,
        description: "A sculptural masterpiece of minimalism, designed to carry your most intimate thoughts. The curved bar sits gracefully against the wrist, hiding a secret engraving known only to you and the wearer. Hand-forged in our Atelier.",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAbyytg4ES8ol9LjG0ATmO_BM8Du0bW9Pj12MQzXPVTU7jrjMMbY-CLtj9aaFHRG3FmBU72ztVsDkDZ19NmFRyv_Ws_UOaqRQ9G-9qcMAUMzHVFOY65gX64EahdXQDmNXl0hgd4DrwBSdEQVRNMEh2U_x1Y6rIaBpxHACyMNGeOr5FV12h_kw-UinugVHvC548mNdgdwAWepx1YwkeFSghsLPCy2_of-LyrPCbiXF9lelaD1k2tBRdMfQUudkrQhsq_kTUvbniy_x8",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCoWvD7tsoFEQbaaS5ruwJAbX4xcJMBbHeW9bDJfkWLFIlctoocOOlQ55Oi_bR6iIAlKdeUzuiSnIlsynSIAySH2P6SsS8RnQxFslPP5jev3xPXC2_yGBRec3Oedjt6xYlSGFr7svTf6IdnXSBSQpkPoBCqcPM0xZxWaPL-x0G-OYNXree8hj4wy8GyylYMLHlUh8ybGnFhu2cWghUvAvLre4JMTVy5T9_CwNIh3cvyN4Ka9XciG6abPygm0GQ-5Wu_a4jHilr-BMw",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBBF6Gf-1OTvd3bK-ZjD0Tqp0TNX5RHov7UFVXuGLmWhJX__366H6CdEBPwGXjJHKkEkezQzXuWx07l9sTFQjIZ2nkz1AyLwgzAKT0YAL2DD6Xw3oEnQbWloxiY7y-y4v1gCra07fct_TUqCT6c72GL9nZRbx2fRWqI4ZFuDWTB75fWMzw36enxcC3V_gkwiIYsJKcyAcyAT3Nq-oSwDw7pipJk8W1w3UhPB3dDGCzfbCGaTehwRQZvXKzUfgjoMWzcUyHS_hy-CHk",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuACq5sVPbO0Q1faTFFvifvn9uL4lZxIiRkVRSAZPumBdp5EhJo20Aa2mKmvmH8cueke7QL2tOz3swkSGUmlNObmZODh3k3J3UUywMpQIQxwiH8oE6Upsoj0ZpqrOGtBZS4E5mQoaejlhZ9e21oy41dbatbI-wbWQw6__OapteyR7UBrHoGDAvx8_LvoRzvuWxj5wG7OMO280W4p1V9canIty2UcXyfsRifxfEh7tJGIymFgmzk7EC9nyiWkN7uz4rbCqZJiF2qSUB4"
        ],
        specs: [
            { label: "Material", value: "18K Solid Gold" },
            { label: "Length", value: "6.5\" + 1\" Extender" },
            { label: "Weight", value: "4.2 Grams" },
            { label: "Craftsmanship", value: "Handmade in London" }
        ]
    };

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1,
            variant: { finish: selectedFinish, message: customMessage }
        });
        toggleCart();
    };

    const handleNavClick = (href: string) => {
        const prefix = storeSlug ? `/${storeSlug}` : "";
        navigate(`${prefix}${href}`);
    };

    return (
        <main className="pt-32 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto bg-stone-50">
            {/* Breadcrumbs */}
            <nav className="mb-12 flex gap-2 text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold">
                <a className="hover:text-primary" href="#" onClick={(e) => { e.preventDefault(); handleNavClick('/products'); }}>Collections</a>
                <span>/</span>
                <span className="text-stone-900">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                {/* Image Gallery (Asymmetric) */}
                <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                    <div className="col-span-2 aspect-[4/5] overflow-hidden bg-white border border-stone-100 shadow-sm">
                        <img className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" src={product.images[0]} alt={product.name}/>
                    </div>
                    <div className="aspect-square overflow-hidden bg-white border border-stone-100 shadow-sm">
                        <img className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" src={product.images[1]} alt={product.name}/>
                    </div>
                    <div className="aspect-square overflow-hidden bg-white border border-stone-100 shadow-sm">
                        <img className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" src={product.images[2]} alt={product.name}/>
                    </div>
                    <div className="col-span-2 aspect-[16/9] overflow-hidden bg-white border border-stone-100 shadow-sm rounded-3xl">
                        <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" src={product.images[3]} alt={product.name}/>
                    </div>
                </div>

                {/* Info Section (Sticky) */}
                <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight leading-tight italic">{product.name}</h1>
                        <p className="text-2xl font-serif italic text-primary">${product.price.toFixed(2)}</p>
                    </div>

                    <div className="space-y-8">
                        {/* Finish Selection */}
                        <div className="space-y-4">
                            <label className="block text-[10px] tracking-[0.3em] uppercase font-bold text-stone-400">Finish Selection</label>
                            <div className="flex gap-4">
                                {['gold', 'silver', 'rose'].map((finish) => (
                                    <button 
                                        key={finish}
                                        onClick={() => setSelectedFinish(finish)}
                                        className={`w-10 h-10 rounded-full ring-offset-2 transition-all ${selectedFinish === finish ? 'ring-2 ring-primary scale-110' : 'hover:ring-1 hover:ring-stone-200'}`}
                                        style={{ 
                                            backgroundColor: finish === 'gold' ? '#D4AF37' : finish === 'silver' ? '#C0C0C0' : '#B76E79',
                                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                        title={finish.charAt(0).toUpperCase() + finish.slice(1)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Engraving */}
                        <div className="space-y-4">
                            <label className="block text-[10px] tracking-[0.3em] uppercase font-bold text-stone-400" htmlFor="message">Enter Your Message</label>
                            <textarea 
                                className="w-full bg-white border-0 border-b border-stone-200 focus:border-primary focus:ring-0 transition-colors py-4 px-0 placeholder:text-stone-200 text-sm font-sans outline-none italic" 
                                id="message" 
                                placeholder="Type your secret message here..." 
                                rows={2}
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                            />
                            <p className="text-[9px] text-stone-400 tracking-[0.2em] font-bold uppercase">Maximum 25 characters. Engraved on the interior surface.</p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4 pt-4">
                            <button 
                                onClick={handleAddToCart}
                                className="w-full py-6 bg-stone-900 text-white text-[11px] tracking-[0.4em] uppercase font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10"
                            >
                                Add to Cart
                            </button>
                            <button className="w-full py-6 bg-white text-stone-900 border border-stone-200 text-[11px] tracking-[0.4em] uppercase font-bold hover:bg-stone-50 transition-all">
                                Buy It Now
                            </button>
                        </div>
                    </div>

                    {/* Specs Accordion */}
                    <div className="space-y-10 pt-12 border-t border-stone-100">
                        <div className="space-y-4">
                            <h3 className="text-xl font-serif italic">The Sentiment</h3>
                            <p className="text-stone-500 leading-relaxed font-sans text-sm">{product.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-8 text-[10px] tracking-[0.2em] uppercase text-stone-400 font-bold">
                            {product.specs.map((spec, idx) => (
                                <div key={idx} className="space-y-2">
                                    <span className="block border-b border-stone-100 pb-2">{spec.label}</span>
                                    <span className="text-stone-900 font-bold">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Voices of AURUM */}
            <section className="mt-40 grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
                <div className="space-y-12">
                    <h2 className="text-3xl font-serif italic mb-6">Atelier Assistance</h2>
                    <div className="space-y-8">
                        {[
                            { q: "How long does engraving take?", a: "Each custom piece requires 7-10 business days for our master engravers to perfect your message before shipping." },
                            { q: "Sustainability & Sourcing", a: "We use 100% recycled gold and ethically sourced materials, ensuring every AURUM piece respects the heritage of the earth." }
                        ].map((faq, idx) => (
                            <div key={idx} className="group border-b border-stone-100 pb-6">
                                <h4 className="text-[10px] tracking-[0.3em] uppercase font-bold mb-4 flex justify-between items-center cursor-pointer text-stone-900 group-hover:text-primary transition-colors">
                                    {faq.q}
                                    <Plus className="w-3.5 h-3.5" />
                                </h4>
                                <p className="text-sm text-stone-500 font-sans leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="flex justify-between items-end">
                        <h2 className="text-3xl font-serif italic mb-6">Voices of AURUM</h2>
                        <div className="text-[10px] tracking-[0.3em] uppercase font-bold text-primary mb-6">4.9 / 5.0</div>
                    </div>
                    <div className="space-y-10">
                        <article className="p-10 bg-white border border-stone-100 shadow-xl shadow-stone-900/[0.02] rounded-[2rem]">
                            <div className="flex mb-6 gap-1 text-primary">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                            </div>
                            <p className="font-serif italic text-lg leading-relaxed mb-8 text-stone-900">"The subtle curve makes it incredibly comfortable for daily wear. The engraving is tiny and perfect—a true secret just for me."</p>
                            <cite className="not-italic text-[9px] tracking-[0.3em] uppercase font-bold text-stone-400">— ELEANOR R., VERIFIED ATELIER CLIENT</cite>
                        </article>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AurelianProductDetail;
