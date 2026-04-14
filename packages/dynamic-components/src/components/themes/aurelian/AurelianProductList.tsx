import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, Heart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string | number;
  image: string;
  category?: string;
  badge?: string;
  material?: string;
}

interface AurelianProductListProps {
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  products?: Product[];
}

const AurelianProductList: React.FC<AurelianProductListProps> = ({
  title = "Modern Heirloom",
  subtitle = "The Signature Collection",
  description = "An archival approach to contemporary adornment. Each piece is hand-carved in our London atelier, celebrating the quiet tension between raw gold and precision-cut stones.",
  badge = "Signature Series",
  products = [
    {
      id: "1",
      name: "Adjustable Ring",
      price: 1250,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBqn2PuoP4ABH1_79zBx-VaxahKOlXwxRhBN7MeDiWP9qtrGE_sKb7Efq3SWZWWxbfHCef3hQMRH_yFLMgrrpf7KW-07k_12_MPtETo8-L2B2AKpW8BZlmX6F8gpU9kMb34zJIae97udEaNY394oZC5xmIyja3f6R4bYB0uImTZ0h8mp2yf45n4kbQwaEPmNyzjBxWCwXYNrYMsuKgSBN4eCYF_izJjfkET4rzj2kQruQy7ZUHP_o0YxQNiLs66IkbwfuGXQmhyCM",
      material: "18k Yellow Gold",
      badge: "Atelier Exclusive"
    },
    {
      id: "2",
      name: "Hidden Message Curved Bar Bracelet",
      price: 3400,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxezXrClyv272vHvTvH9PywSe4vTAkmhlh07bzJieaJ0oLYCEnC8wJ-2SnwKnC_iLFGn8_gHSsrk_0yi4TFpZcUez7JwBcXt_oLRkuISbJAu7SeFTbpCcaGhfJ3KjtiBidymlw3mE7-VaFG7gs0QRzYlUGN4PuE2_V0FRlwIX6mmlVV04oRHPnfvu4Z10dAfJaZmDyb--xcSHlZQLmkFF-gndlg1MjUi4YCd3OHhoM9G4MS1BLMPCiZw8WA4fCIOIXkkBddi6uyRM",
      material: "Rose Gold"
    },
    {
      id: "3",
      name: "Initials Birthstone Necklace",
      price: 950,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHc3CnLFGIyvfw1KuKRVZtKaNIpDuCoaL-zPrX-hUk-19QjjfiVdWMAR9NEGX2R516crktT_o8oivxZBlWQOApEAvejfHWG1O8F4cPSkie_qTmRl-IDRvBlkuTt4P0fIG-A3D9rFPsjbB-Xv2Tm-SFr2vlWL6BpE_V6AiI55QQoUdp6Tc5C5g26EGHmA4GthXX1hooBK6vxQ7Us1dc3OrYOULFuG47K6PYKUVkEdKZZUzhMQ-QbCl0GPGFNnYRyLNu7J7xue2m6ns",
      material: "White Gold & Sapphire"
    },
    {
      id: "4",
      name: "Name Engraved Bracelet",
      price: 2100,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJaztcEp2tjRFf7HCKe7SbjGO6wD-vBALEXCNW51fsCw6w4SPACIdld1XsTFVfS3Mxjxd4Nz3pksONA1SKqOoO2uxLEzhTBF1u96nlFSpj1eqBoBsiOVSWzGamTZMwk1bQjplO-4cv4udnJ8fGY5DfalcJx7hX4OvfdcoUHCrrwKWRy5rAPdQHjHPMZzi1KQo8pF1upy-NCiLNvT8Iz5M_ODr75m2ypWEHHciKFZLnPviUDVFEO2R4YkTq6NLoRmZu7_U2onNxJ-I",
      material: "18k Yellow Gold"
    }
  ]
}) => {
  const navigate = useNavigate();
  const { storeSlug } = useParams();
  const [activeCategory, setActiveCategory] = useState('All');

  const handleProductClick = (id: string) => {
    const prefix = storeSlug ? `/${storeSlug}` : "";
    navigate(`${prefix}/product/${id}`);
  };

  const formatPrice = (price: string | number) => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  return (
    <main className="pt-32 pb-20 px-6 md:px-12 max-w-full mx-auto bg-stone-50">
      {/* Hero Title Section */}
      <header className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-primary mb-4 block font-bold">
              {subtitle}
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-light tracking-tight text-stone-900 italic">
              {title}
            </h1>
          </div>
          <div className="md:w-1/3">
            <p className="font-sans text-xs md:text-sm text-stone-500 leading-relaxed mb-6">
              {description}
            </p>
          </div>
        </div>
      </header>

      {/* Filters & Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-stone-200 mb-12">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="text-[10px] tracking-widest uppercase font-sans font-bold text-stone-900">Filter By</span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-primary transition-all" />
          </div>
          <div className="hidden sm:flex gap-8">
            {['All', 'Rings', 'Bracelets', 'Necklaces'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] tracking-widest uppercase font-sans font-bold transition-colors ${activeCategory === cat ? 'text-primary border-b border-primary pb-1' : 'text-stone-400 hover:text-stone-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] tracking-widest uppercase font-sans font-bold text-stone-400">Sort:</span>
          <select className="bg-transparent border-none text-[10px] tracking-widest uppercase font-sans font-bold p-0 pr-8 focus:ring-0 cursor-pointer text-stone-900">
            <option>Newest First</option>
            <option>Price: High to Low</option>
            <option>Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {products.map((product, idx) => (
          <div 
            key={product.id} 
            className={`group cursor-pointer ${idx % 2 === 1 ? 'lg:mt-12' : ''}`}
            onClick={() => handleProductClick(product.id)}
          >
            <div className="relative overflow-hidden mb-6 bg-white aspect-[4/5] flex items-center justify-center border border-stone-100 shadow-sm">
              <img 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-1000" 
                src={product.image}
                alt={product.name}
              />
              {product.badge && (
                <div className="absolute bottom-4 left-4">
                  <span className="bg-stone-900/10 backdrop-blur-md text-stone-900 px-3 py-1 text-[8px] tracking-widest uppercase font-sans font-bold border border-stone-900/10">
                    {product.badge}
                  </span>
                </div>
              )}
              <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 backdrop-blur-md p-2 hover:bg-white hover:text-red-500 rounded-full">
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-base font-serif tracking-wide text-stone-900 line-clamp-1 italic">{product.name}</h3>
                <span className="font-sans text-xs text-stone-500 font-bold">{formatPrice(product.price)}</span>
              </div>
              <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-stone-400 font-bold">{product.material || 'Artisan Craft'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Asymmetric Section */}
      <section className="mt-40 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 aspect-video bg-stone-200 overflow-hidden rounded-[2rem] shadow-2xl relative group">
          <img 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU09bsugz5uBBL29zanLg7AiFd3-wM9wBHR_BJF06BUFSZ1BZmfQQiPbFukhtLzZyKLHUpxN_OP4OQD9lrtYGBsFJaT4KrDhk4f5PJPKIDxE_Rhs-58rxr9b_oIShilebFRh6Fmm804c8XFO_6RMKm9VAVdDg6FvXs1jkKnB0RFdY94aLxveXEh3FhbaWlujeSwauzVT3aUQhdGsPqj8fAVUaZ8pOV8F7478ELu78XyoUV1quL1xlsMj71kkTxpox4V4ifv9BgmcY"
            alt="Sustainability"
          />
          <div className="absolute inset-0 bg-stone-900/10"></div>
        </div>
        <div className="lg:col-span-5 lg:pl-12 space-y-8">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-primary mb-4 block font-bold">Sustainability</span>
          <h2 className="text-4xl font-serif italic mb-6 leading-tight">Ethical Brilliance</h2>
          <p className="font-sans text-sm text-stone-500 leading-relaxed mb-8">
            We exclusively use recycled 18k gold and conflict-free diamonds sourced through the Kimberley Process. Our commitment to the earth is as enduring as the jewelry we create.
          </p>
          <button className="bg-primary text-on-primary px-10 py-5 text-[10px] tracking-[0.3em] uppercase font-sans font-bold hover:bg-stone-800 transition-all shadow-xl shadow-primary/20">
            Read Our Care Guide
          </button>
        </div>
      </section>
    </main>
  );
};

export default AurelianProductList;
