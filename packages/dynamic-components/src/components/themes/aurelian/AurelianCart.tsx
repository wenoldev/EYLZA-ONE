import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

const AurelianCart: React.FC = () => {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const navigate = useNavigate();
  const { storeSlug } = useParams();

  const handleNavClick = (href: string) => {
    const prefix = storeSlug ? `/${storeSlug}` : "";
    navigate(`${prefix}${href}`);
  };

  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <main className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-8 border border-stone-200 shadow-inner">
          <ShoppingBag className="w-8 h-8 text-stone-300" />
        </div>
        <h1 className="text-4xl font-serif italic mb-4">Your bag is empty</h1>
        <p className="text-stone-500 font-sans text-sm mb-12 max-w-xs uppercase tracking-widest leading-relaxed opacity-60">
          The most rare treasures are yet to be found.
        </p>
        <button 
          onClick={() => handleNavClick('/products')}
          className="bg-primary text-on-primary px-12 py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-stone-800 transition-all shadow-xl shadow-primary/20"
        >
          Explore Collections
        </button>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen bg-stone-50">
      <header className="mb-16">
        <h1 className="text-5xl md:text-6xl font-serif font-light tracking-tight text-stone-900 mb-4 italic">Your Bag</h1>
        <p className="text-stone-400 font-sans uppercase tracking-[0.2em] text-[10px] font-bold">Review your selected treasures</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-12">
          {items.map((item) => (
            <div key={item.id} className="group relative flex flex-col md:flex-row gap-8 bg-white p-6 md:p-0 border border-stone-100 shadow-sm rounded-3xl overflow-hidden md:border-none md:bg-transparent md:shadow-none">
              <div className="w-full md:w-56 aspect-[4/5] overflow-hidden bg-white border border-stone-100 shadow-sm rounded-2xl">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              
              <div className="flex flex-col flex-1 py-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-serif mb-1 italic">{item.name}</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
                      {item.variant?.finish ? `${item.variant.finish} Finish` : 'Handcrafted Edition'}
                    </p>
                    {item.variant?.message && (
                      <p className="text-[9px] italic text-primary mt-2 flex items-center gap-2">
                        <span className="w-1 h-1 bg-primary rounded-full" />
                        "{item.variant.message}"
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-stone-300 hover:text-red-500 transition-colors p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap gap-8 items-end justify-between">
                  <div className="space-y-4">
                    <div className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold">Quantity</div>
                    <div className="flex items-center border border-stone-100 bg-white shadow-sm w-fit rounded-full overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-4 py-2 hover:bg-stone-50 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-4 py-2 text-xs font-bold text-stone-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-4 py-2 hover:bg-stone-50 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xl font-serif italic text-stone-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-12 space-y-6 border-t border-stone-200">
            <div className="flex items-center gap-4 text-stone-500 bg-stone-100/50 p-4 rounded-2xl border border-stone-100">
              <Truck className="w-5 h-5 text-primary" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Complimentary White-Glove Shipping included</span>
            </div>
            <div className="flex items-center gap-4 text-stone-500 bg-stone-100/50 p-4 rounded-2xl border border-stone-100">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Lifetime Authenticity & Care Guarantee</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <aside className="lg:col-span-4">
          <div className="bg-white p-8 md:p-10 sticky top-32 border border-stone-100 shadow-2xl shadow-stone-900/[0.03] rounded-[2.5rem]">
            <h2 className="text-3xl font-serif mb-8 italic">Order Summary</h2>
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center text-xs font-bold font-sans">
                <span className="text-stone-400 uppercase tracking-widest">Subtotal</span>
                <span className="font-serif italic text-lg text-stone-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold font-sans">
                <span className="text-stone-400 uppercase tracking-widest">Shipping</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-primary font-bold">Complimentary</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold font-sans">
                <span className="text-stone-400 uppercase tracking-widest">Tax</span>
                <span className="font-serif text-[10px] italic text-stone-400">Calculated at checkout</span>
              </div>
              <div className="pt-8 border-t border-stone-100 flex justify-between items-end">
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-900">Total</span>
                <span className="text-3xl font-serif italic text-primary">${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => handleNavClick('/checkout')}
              className="w-full bg-primary text-on-primary py-6 px-8 uppercase tracking-[0.4em] text-[11px] font-bold hover:bg-stone-800 transition-all duration-300 mb-6 shadow-xl shadow-primary/20"
            >
              Proceed to Checkout
            </button>
            <div className="space-y-6">
              <p className="text-[9px] text-center text-stone-400 uppercase tracking-[0.2em] font-bold leading-relaxed">
                Secure payment via major credit cards, wire transfer, or artisanal financing.
              </p>
            </div>
          </div>

          <div className="mt-8 p-8 bg-stone-900 text-stone-100 rounded-[2rem] border border-stone-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
            <p className="text-xs italic serif leading-relaxed mb-6 opacity-80 relative z-10">
              "Each piece from our Atelier is handcrafted to order. Please allow 14 days for the final meticulous inspection before dispatch."
            </p>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleNavClick('/contact'); }}
              className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-primary pb-1 hover:text-primary transition-colors relative z-10"
            >
              Contact a Curator
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default AurelianCart;
