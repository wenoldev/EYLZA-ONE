import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface SideCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideCart: React.FC<SideCartProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible delay-300'}`}>
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`absolute inset-y-0 right-0 max-w-md w-full bg-card shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-serif font-bold">Your Cart</h2>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
              {items.length} Items
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-24 bg-accent rounded-lg overflow-hidden flex-shrink-0 border border-border/50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold truncate leading-tight pr-2">{item.name}</h3>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {item.attributes && (
                    <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2">
                      {Object.entries(item.attributes).map(([key, val]) => (
                        <span key={key} className="text-[10px] text-muted-foreground uppercase font-medium bg-accent px-1.5 py-0.5 rounded">
                          {key}: {val}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-border rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-accent disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold tabular-nums">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-accent"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold tabular-nums">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div>
                <p className="text-lg font-serif font-bold italic">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-1">Looks like you haven't added anything yet.</p>
              </div>
              <button 
                onClick={onClose}
                className="text-primary font-bold text-sm underline underline-offset-4 hover:text-primary/80 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-border bg-card">
            <div className="flex justify-between mb-4">
              <span className="text-muted-foreground font-medium">Subtotal</span>
              <span className="text-xl font-serif font-bold tabular-nums">₹{getSubtotal().toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="space-y-3">
              <Link 
                to="/checkout" 
                onClick={onClose}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 group transition-all"
              >
                Checkout Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                to="/cart" 
                onClick={onClose}
                className="w-full bg-accent hover:bg-accent/80 text-foreground font-bold py-3 rounded-xl flex items-center justify-center transition-all text-sm"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideCart;
