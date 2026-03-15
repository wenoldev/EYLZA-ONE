import { useState } from "react"
import { ChevronRight, ShoppingCart, Tag, Info, ShieldCheck } from "lucide-react"

const cartItems = [
  {
    id: 1,
    name: "Initials Birthstone Necklace",
    price: 1499,
    image: "/images/image.png",
    color: "Silver",
    birthstone: "January - Garnet (6 mm)",
    initials: "A",
    quantity: 1,
  },
]

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [billingAddress, setBillingAddress] = useState("same")
  const [shippingAddress, setShippingAddress] = useState("")
  const [discountCode, setDiscountCode] = useState("")

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Mobile Header with Order Summary Toggle */}
      <div className="lg:hidden border-b border-gray-200 bg-gray-50 py-4 px-4 sticky top-0 z-50">
        <button className="flex items-center justify-between w-full text-blue-600">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm font-medium">Show order summary</span>
          </div>
          <span className="font-bold text-lg text-gray-900">₹{total.toLocaleString()}</span>
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row min-h-screen">
        {/* Left Side: Checkout Form */}
        <div className="w-full lg:w-[58%] px-4 py-8 lg:py-12 lg:pr-12">
          {/* Logo/Brand (Optional placeholder) */}
          <div className="mb-8">
            <h1 className="text-2xl font-serif-premium font-bold tracking-tight">EYLZA</h1>
          </div>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
            <span className="text-blue-600 font-medium">Cart</span>
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
                <div className="text-xs text-gray-600">
                  Already have an account? <button className="text-blue-600 underline">Log in</button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all peer placeholder-transparent"
                  />
                  <label 
                    htmlFor="email"
                    className="absolute left-4 top-1.5 text-[10px] uppercase font-bold text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold pointer-events-none"
                  >
                    Email
                  </label>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input type="checkbox" id="newsletter" className="w-4 h-4 rounded text-blue-600" />
                  <label htmlFor="newsletter" className="text-sm text-gray-600 cursor-pointer">Email me with news and offers</label>
                </div>
              </div>
            </section>

            {/* Delivery Section */}
            <section>
              <h2 className="text-lg font-medium mb-4">Delivery</h2>
              <div className="space-y-4">
                <div className="relative group">
                  <select className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all peer bg-white appearance-none">
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
                      id="first_name"
                      placeholder="First name"
                      className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all peer placeholder-transparent"
                    />
                    <label 
                      htmlFor="first_name"
                      className="absolute left-4 top-1.5 text-[10px] uppercase font-bold text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold pointer-events-none"
                    >
                      First name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="last_name"
                      placeholder="Last name"
                      className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all peer placeholder-transparent"
                    />
                    <label 
                      htmlFor="last_name"
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
                    className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all peer placeholder-transparent"
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
                    className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all peer placeholder-transparent"
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
                      className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all peer placeholder-transparent"
                    />
                    <label 
                      htmlFor="city"
                      className="absolute left-4 top-1.5 text-[10px] uppercase font-bold text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold pointer-events-none"
                    >
                      City
                    </label>
                  </div>
                  <div className="relative col-span-1">
                    <select className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all peer bg-white appearance-none">
                      <option value="MH">Maharashtra</option>
                    </select>
                    <label className="absolute left-4 top-1.5 text-[10px] uppercase font-bold text-gray-500">
                      State
                    </label>
                  </div>
                  <div className="relative col-span-1">
                    <input
                      type="text"
                      id="pin"
                      placeholder="PIN code"
                      className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all peer placeholder-transparent"
                    />
                    <label 
                      htmlFor="pin"
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
                    className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all peer placeholder-transparent"
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
                  <input type="checkbox" id="save_info" className="w-4 h-4 rounded text-blue-600" />
                  <label htmlFor="save_info" className="text-sm text-gray-600 cursor-pointer">Save this information for next time</label>
                </div>
              </div>
            </section>

            {/* Shipping Method (Simplified placeholder) */}
            <section>
              <h2 className="text-lg font-medium mb-4">Shipping method</h2>
              <div className="bg-gray-50 border border-gray-200 rounded p-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">Enter your shipping address to view available shipping methods.</span>
              </div>
            </section>

            {/* Payment (Shopify style) */}
            <section>
              <h2 className="text-lg font-medium mb-1 tracking-tight">Payment</h2>
              <p className="text-[13px] text-gray-500 mb-4">All transactions are secure and encrypted.</p>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Razorpay Option */}
                <div 
                  className={`p-4 cursor-pointer transition-colors ${paymentMethod === "razorpay" ? "bg-blue-50/50" : "bg-white hover:bg-gray-50/80"}`}
                  onClick={() => setPaymentMethod("razorpay")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center bg-white">
                      {paymentMethod === "razorpay" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Razorpay Secure (UPI, Cards, Int'l Cards, Wallets)</span>
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-gray-100 rounded border border-gray-200" />
                        <div className="w-8 h-5 bg-gray-100 rounded border border-gray-200" />
                        <div className="w-8 h-5 bg-gray-100 rounded border border-gray-200" />
                      </div>
                    </div>
                  </div>
                  {paymentMethod === "razorpay" && (
                    <div className="mt-4 pt-4 border-t border-gray-200 text-center py-10 bg-gray-50/50 rounded-b-lg">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 text-gray-300 mb-4">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="3" y="4" width="18" height="16" rx="2" />
                            <path d="M3 10h18" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600 max-w-xs mx-auto">
                          After clicking \"Complete order\", you will be redirected to Razorpay Secure to complete your purchase securely.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* COD Option */}
                <div 
                  className={`p-4 border-t border-gray-200 cursor-pointer transition-colors ${paymentMethod === "cod" ? "bg-blue-50/50" : "bg-white hover:bg-gray-50/80"}`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center bg-white">
                      {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                    <span className="text-sm font-medium">Cash on Delivery (COD)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Billing Address Section */}
            <section>
              <h2 className="text-lg font-medium mb-4 tracking-tight">Billing address</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className={`p-4 cursor-pointer transition-colors ${billingAddress === "same" ? "bg-blue-50/50" : "bg-white hover:bg-gray-50/80"}`}
                  onClick={() => setBillingAddress("same")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center bg-white">
                      {billingAddress === "same" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                    <span className="text-sm font-medium">Same as shipping address</span>
                  </div>
                </div>
                <div 
                  className={`p-4 border-t border-gray-200 cursor-pointer transition-colors ${billingAddress === "different" ? "bg-blue-50/50" : "bg-white hover:bg-gray-50/80"}`}
                  onClick={() => setBillingAddress("different")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center bg-white">
                      {billingAddress === "different" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                    <span className="text-sm font-medium">Use a different billing address</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="pt-4">
              <button className="w-full bg-gray-900 hover:bg-black text-white font-bold py-5 rounded-lg transition-all text-sm tracking-wide uppercase">
                Complete order
              </button>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 justify-center border-t border-gray-200 pt-6">
                <button className="text-[10px] uppercase font-bold text-blue-600 underline">Refund policy</button>
                <button className="text-[10px] uppercase font-bold text-blue-600 underline">Shipping policy</button>
                <button className="text-[10px] uppercase font-bold text-blue-600 underline">Privacy policy</button>
                <button className="text-[10px] uppercase font-bold text-blue-600 underline">Terms of service</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary (Sticky Sidebar) */}
        <div className="w-full lg:w-[42%] bg-gray-50 lg:border-l border-gray-200 px-4 py-8 lg:py-12 lg:pl-12">
          <div className="lg:sticky lg:top-12 space-y-8">
            {/* Cart Items */}
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-lg border border-gray-200 bg-white overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center text-[11px] font-medium z-10">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500 mb-0.5">{item.color} / {item.birthstone}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Initials: {item.initials}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ₹{item.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Discount Form */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <input
                type="text"
                placeholder="Discount code or gift card"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
              />
              <button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-bold transition-colors disabled:opacity-50" disabled={!discountCode}>
                Apply
              </button>
            </div>

            {/* Pricing Details */}
            <div className="space-y-3 pt-6 text-[13px]">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1.5">
                  Shipping 
                  <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                </span>
                <span className="text-gray-400">Calculated at next step</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated taxes</span>
                <span className="font-medium">₹{tax.toLocaleString()}</span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-base font-bold">Total</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-gray-500 font-medium">INR</span>
                  <span className="text-xl font-bold tracking-tight">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 text-right">Including ₹{tax.toLocaleString()} in taxes</p>
            </div>

            {/* Trust Badges */}
            <div className="pt-10 flex items-center justify-center gap-6 text-gray-400">
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck className="w-6 h-6" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
