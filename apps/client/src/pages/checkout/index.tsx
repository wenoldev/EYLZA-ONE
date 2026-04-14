import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronRight, ShoppingCart, Tag, Info, ShieldCheck, CheckCircle2 } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"
import { useUserStore } from "@/store/useUserStore"
import { useStore } from "@/store/useStore"

export default function Checkout() {
  const { items, getSubtotal, clearCart } = useCartStore()
  const { user, isAuthenticated } = useUserStore()
  const { store } = useStore()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [billingAddress, setBillingAddress] = useState("same")
  const [discountCode, setDiscountCode] = useState("")
  const [showSummaryMobile, setShowSummaryMobile] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.name?.split(' ')[0] || "",
    lastName: user?.name?.split(' ').slice(1).join(' ') || "",
    address: "",
    apartment: "",
    city: "",
    state: "MH",
    pinCode: "",
    phone: user?.phone || ""
  })

  const subtotal = getSubtotal()
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + tax

  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      navigate('/cart')
    }
  }, [items, navigate, isProcessing])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleCompleteOrder = async () => {
    setIsProcessing(true)
    // Mocking order creation
    setTimeout(() => {
      console.log("Order placed:", { items, total, formData, paymentMethod })
      clearCart()
      // In a real app, redirect to success page
      // navigate('/order-success')
      setIsProcessing(false)
      alert("Order placed successfully! (Mock)")
      navigate('/')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Mobile Header with Order Summary Toggle */}
      <div className="lg:hidden border-b border-gray-200 bg-gray-50 py-4 px-4 sticky top-0 z-50">
        <button 
          onClick={() => setShowSummaryMobile(!showSummaryMobile)}
          className="flex items-center justify-between w-full text-primary"
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm font-medium">{showSummaryMobile ? 'Hide' : 'Show'} order summary</span>
          </div>
          <span className="font-bold text-lg text-gray-900">₹{total.toLocaleString()}</span>
        </button>
        {showSummaryMobile && (
           <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-4">
              <OrderSummary items={items} subtotal={subtotal} tax={tax} total={total} discountCode={discountCode} setDiscountCode={setDiscountCode} />
           </div>
        )}
      </div>

      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row min-h-screen">
        {/* Left Side: Checkout Form */}
        <div className="w-full lg:w-[58%] px-4 py-8 lg:py-12 lg:pr-12">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-2xl font-serif font-bold tracking-tight text-primary uppercase italic">
              {store?.name || 'EYLZA'}
            </h1>
          </div>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
            <Link to="/cart" className="text-primary font-medium">Cart</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-gray-900 font-medium">Information</span>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span>Shipping</span>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span>Payment</span>
          </nav>

          <div className="space-y-10">
            {/* Contact Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium tracking-tight">Contact</h2>
                {!isAuthenticated && (
                  <div className="text-xs text-gray-600">
                    Already have an account? <Link to="/login" className="text-primary underline font-bold">Log in</Link>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all peer placeholder-transparent"
                  />
                  <label 
                    htmlFor="email"
                    className="absolute left-4 top-1.5 text-[10px] uppercase font-bold text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold pointer-events-none"
                  >
                    Email
                  </label>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input type="checkbox" id="newsletter" className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary" />
                  <label htmlFor="newsletter" className="text-sm text-gray-600 cursor-pointer">Email me with news and offers</label>
                </div>
              </div>
            </section>

            {/* Delivery Section */}
            <section>
              <h2 className="text-lg font-medium mb-4">Delivery</h2>
              <div className="space-y-4">
                <div className="relative group">
                  <select className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all peer bg-white appearance-none cursor-pointer">
                    <option value="IN">India</option>
                  </select>
                  <label className="absolute left-4 top-1.5 text-[10px] uppercase font-bold text-gray-500">
                    Country/Region
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all peer placeholder-transparent"
                    />
                    <label 
                      htmlFor="firstName"
                      className="absolute left-4 top-1.5 text-[10px] uppercase font-bold text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold pointer-events-none"
                    >
                      First name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all peer placeholder-transparent"
                    />
                    <label 
                      htmlFor="lastName"
                      className="absolute left-4 top-1.5 text-[10px] uppercase font-bold text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold pointer-events-none"
                    >
                      Last name
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all peer placeholder-transparent"
                  />
                  <label 
                    htmlFor="address"
                    className="absolute left-4 top-1.5 text-[10px] uppercase font-bold text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold pointer-events-none"
                  >
                    Address
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="apartment"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all peer placeholder-transparent"
                  />
                  <label 
                    htmlFor="apartment"
                    className="absolute left-4 top-1.5 text-[10px] uppercase font-bold text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold pointer-events-none"
                  >
                    Apartment, suite, etc. (optional)
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="relative col-span-1">
                    <input
                      type="text"
                      id="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all peer placeholder-transparent"
                    />
                    <label 
                      htmlFor="city"
                      className="absolute left-4 top-1.5 text-[10px] uppercase font-bold text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold pointer-events-none"
                    >
                      City
                    </label>
                  </div>
                  <div className="relative col-span-1">
                    <select 
                      id="state" 
                      value={formData.state} 
                      onChange={handleInputChange} 
                      className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all peer bg-white appearance-none"
                    >
                      <option value="MH">Maharashtra</option>
                      <option value="DL">Delhi</option>
                      <option value="KA">Karnataka</option>
                    </select>
                    <label className="absolute left-4 top-1.5 text-[10px] uppercase font-bold text-gray-500">
                      State
                    </label>
                  </div>
                  <div className="relative col-span-1">
                    <input
                      type="text"
                      id="pinCode"
                      placeholder="PIN code"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all peer placeholder-transparent"
                    />
                    <label 
                      htmlFor="pinCode"
                      className="absolute left-4 top-1.5 text-[10px] uppercase font-bold text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold pointer-events-none"
                    >
                      PIN code
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all peer placeholder-transparent"
                  />
                  <label 
                    htmlFor="phone"
                    className="absolute left-4 top-1.5 text-[10px] uppercase font-bold text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold pointer-events-none"
                  >
                    Phone
                  </label>
                  <div className="absolute right-4 top-4 text-gray-400">
                    <Info className="w-4 h-4 cursor-help" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <input type="checkbox" id="save_info" className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary" />
                  <label htmlFor="save_info" className="text-sm text-gray-600 cursor-pointer">Save this information for next time</label>
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section>
              <h2 className="text-lg font-medium mb-1 tracking-tight">Payment</h2>
              <p className="text-[13px] text-gray-500 mb-4">All transactions are secure and encrypted.</p>
              
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {/* Razorpay Option */}
                <div 
                  className={`p-4 cursor-pointer transition-all ${paymentMethod === "razorpay" ? "bg-primary/5" : "bg-white hover:bg-gray-50"}`}
                  onClick={() => setPaymentMethod("razorpay")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center bg-white transition-all ${paymentMethod === "razorpay" ? "border-primary" : "border-gray-300"}`}>
                      {paymentMethod === "razorpay" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-bold">Razorpay Secure (UPI, Cards, Wallets)</span>
                      <div className="flex gap-1.5">
                         <div className="w-8 h-5 bg-white rounded border border-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-400">UPI</div>
                         <div className="w-8 h-5 bg-white rounded border border-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-400">VISA</div>
                         <div className="w-8 h-5 bg-white rounded border border-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-400">MC</div>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === "razorpay" && (
                    <div className="mt-4 p-6 bg-accent/20 rounded-lg text-center animate-in zoom-in-95 duration-200">
                      <div className="flex flex-col items-center">
                        <CheckCircle2 className="w-10 h-10 text-primary/40 mb-3" />
                        <p className="text-sm text-gray-600 max-w-xs mx-auto">
                          After clicking "Complete order", you will be redirected to Razorpay Secure to complete your purchase safely.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* COD Option */}
                <div 
                  className={`p-4 border-t border-gray-200 cursor-pointer transition-all ${paymentMethod === "cod" ? "bg-primary/5" : "bg-white hover:bg-gray-50"}`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center bg-white transition-all ${paymentMethod === "cod" ? "border-primary" : "border-gray-300"}`}>
                      {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <span className="text-sm font-bold">Cash on Delivery (COD)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="pt-4">
              <button 
                onClick={handleCompleteOrder}
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-xl transition-all text-sm tracking-widest uppercase shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                   <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                   </span>
                ) : 'Complete order'}
              </button>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 justify-center border-t border-gray-100 pt-8">
                <Link to="/policy/refund" className="text-[10px] uppercase font-bold text-primary hover:underline">Refund policy</Link>
                <Link to="/policy/shipping" className="text-[10px] uppercase font-bold text-primary hover:underline">Shipping policy</Link>
                <Link to="/policy/privacy" className="text-[10px] uppercase font-bold text-primary hover:underline">Privacy policy</Link>
                <Link to="/policy/tos" className="text-[10px] uppercase font-bold text-primary hover:underline">Terms of service</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary (Sticky Sidebar) */}
        <div className="hidden lg:block w-full lg:w-[42%] bg-gray-50 lg:border-l border-gray-200 px-4 py-8 lg:py-12 lg:pl-12">
          <div className="lg:sticky lg:top-12 space-y-8">
            <OrderSummary items={items} subtotal={subtotal} tax={tax} total={total} discountCode={discountCode} setDiscountCode={setDiscountCode} />
            
            {/* Trust Badges */}
            <div className="pt-10 flex items-center justify-center gap-10 text-gray-400">
              <div className="flex flex-col items-center gap-1.5 group">
                <ShieldCheck className="w-6 h-6 group-hover:text-primary transition-colors" />
                <span className="text-[9px] uppercase font-bold tracking-widest group-hover:text-gray-600">Secure Checkout</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 group">
                <CheckCircle2 className="w-6 h-6 group-hover:text-primary transition-colors" />
                <span className="text-[9px] uppercase font-bold tracking-widest group-hover:text-gray-600">Verified Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderSummary({ items, subtotal, tax, total, discountCode, setDiscountCode }: any) {
    return (
        <div className="space-y-8">
            {/* Cart Items */}
            <div className="space-y-5">
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative">
                    <div className="w-16 h-20 rounded-lg border border-gray-200 bg-white overflow-hidden flex-shrink-0 shadow-sm">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center text-[10px] font-bold z-10 shadow-sm">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate leading-tight mb-0.5">{item.name}</h3>
                    {item.attributes && (
                       <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                         {Object.values(item.attributes).join(' / ')}
                       </p>
                    )}
                  </div>
                  <div className="text-sm font-bold text-gray-900 tabular-nums">
                    ₹{item.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Discount Form */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <div className="relative flex-1">
                 <input
                    type="text"
                    placeholder="Discount code or gift card"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm transition-all"
                 />
                 <Tag className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              </div>
              <button 
                 className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-bold transition-all disabled:opacity-50" 
                 disabled={!discountCode}
              >
                Apply
              </button>
            </div>

            {/* Pricing Details */}
            <div className="space-y-3 pt-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold tabular-nums">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-1.5">
                  Estimated taxes
                  <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                </span>
                <span className="font-bold tabular-nums">₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-primary/5 p-3 rounded-lg border border-primary/10">
                <span className="text-primary font-bold text-xs uppercase tracking-wider">Shipping</span>
                <span className="text-[10px] font-bold text-primary uppercase bg-primary/20 px-2 py-0.5 rounded tracking-tighter">
                   Free shipping applied
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-lg font-serif font-bold italic">Total</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] text-gray-400 font-bold tracking-widest">INR</span>
                  <span className="text-2xl font-serif font-bold tracking-tight text-primary tabular-nums">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 text-right opacity-60">Including ₹{tax.toLocaleString()} in taxes</p>
            </div>
        </div>
    )
}
