import { Link } from "react-router-dom"
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"

export default function Cart() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore()
  
  const subtotal = getSubtotal()
  const tax = Math.round(subtotal * 0.1) // Simple 10% tax mock
  const total = subtotal + tax

  return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
             <ShoppingBag className="w-8 h-8 text-primary" />
             <h1 className="text-3xl md:text-4xl font-serif font-bold">Your cart</h1>
          </div>
          <Link to="/products" className="text-sm font-bold text-primary hover:underline transition-all">
            Continue shopping
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-8">
              {/* Column Headers */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border/50">
                <div className="col-span-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Product</div>
                <div className="col-span-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
                  Quantity
                </div>
                <div className="col-span-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">
                  Total
                </div>
              </div>

              {/* Cart Item */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="md:grid md:grid-cols-12 md:gap-4 md:items-start pb-8 border-b border-border/50 last:border-b-0 group"
                >
                  {/* Image & Main Info */}
                  <div className="col-span-6 mb-4 md:mb-0">
                    <div className="flex gap-4">
                      <div className="w-24 h-32 md:w-32 md:h-40 bg-accent rounded-xl overflow-hidden flex-shrink-0 border border-border/30">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 flex flex-col pt-2">
                        <h3 className="font-serif text-base md:text-lg font-bold mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                        <p className="text-sm font-medium text-muted-foreground mb-3">₹ {item.price.toLocaleString()}</p>
                        
                        {item.attributes && (
                           <div className="space-y-1">
                             {Object.entries(item.attributes).map(([key, val]) => (
                               <p key={key} className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                 <span className="font-bold">{key}:</span> {val}
                               </p>
                             ))}
                           </div>
                        )}
                        
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantity (desktop) */}
                  <div className="col-span-3 hidden md:flex items-center justify-center">
                    <div className="flex items-center border border-border rounded-lg bg-card shadow-sm overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 px-3 hover:bg-accent disabled:opacity-30 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 text-sm font-bold tabular-nums border-x border-border">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 px-3 hover:bg-accent transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quantity (mobile) */}
                  <div className="md:hidden flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Quantity</span>
                    <div className="flex items-center border border-border rounded-lg bg-card">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 px-4 hover:bg-accent disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 text-sm font-bold tabular-nums">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 px-4 hover:bg-accent"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-3 md:text-right flex md:block items-center justify-between">
                    <span className="md:hidden text-xs font-bold text-muted-foreground uppercase">Subtotal</span>
                    <p className="text-lg font-serif font-bold text-foreground">₹ {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-accent/30 rounded-2xl p-8 lg:sticky lg:top-24 border border-border/50">
                <h3 className="font-serif text-xl font-bold mb-8 italic">Order Summary</h3>

                <div className="space-y-4 mb-8 pb-8 border-b border-border/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold tabular-nums">₹ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (10%)</span>
                    <span className="font-bold tabular-nums">₹ {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded tracking-tighter">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="mb-10">
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif font-bold text-2xl italic text-primary">Total</span>
                    <span className="font-serif font-bold text-2xl tabular-nums">₹ {total.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all text-center flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Secure SSL encrypted payment
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    7-day free return policy
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 bg-accent/10 rounded-3xl border border-dashed border-border flex flex-col items-center">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6">
               <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-3 italic">Your cart is empty</h2>
            <p className="text-muted-foreground mb-10 max-w-xs mx-auto">Discover our handcrafted collection and find something beautiful today.</p>
            <Link
              to="/products"
              className="bg-primary text-white px-10 py-3.5 rounded-full font-bold hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </main>
  )
}

function ArrowRight(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
