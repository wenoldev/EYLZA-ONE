import { useState } from "react"

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

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + tax

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div>
            <h2 className="text-lg md:text-xl font-serif font-bold mb-6">Shipping Address</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First name"
                  className="col-span-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#a4ac86]"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  className="col-span-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#a4ac86]"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#a4ac86]"
              />
              <input
                type="tel"
                placeholder="Phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#a4ac86]"
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#a4ac86]"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  className="col-span-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#a4ac86]"
                />
                <input
                  type="text"
                  placeholder="PIN code"
                  className="col-span-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#a4ac86]"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h2 className="text-lg md:text-xl font-serif font-bold mb-4">Payment</h2>
            <p className="text-sm text-gray-600 mb-6">All transactions are secure and encrypted.</p>

            <div className="space-y-3">
              {/* Razorpay */}
              <label
                className={`flex items-start gap-4 p-4 border-2 rounded cursor-pointer transition ${paymentMethod === "razorpay"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 mt-1 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">Razorpay Secure (UPI, Cards, Int'l Cards, Wallets)</span>
                  </div>
                  {paymentMethod === "razorpay" && (
                    <div className="flex gap-2 items-center mt-3">
                      <div className="border-2 border-gray-300 rounded p-3 flex items-center justify-center w-12 h-12 bg-white">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="3" y="4" width="18" height="16" rx="1" />
                          <path d="M3 10h18" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-500">
                        After clicking "Pay now", you will be redirected to Razorpay Secure to complete your purchase
                        securely.
                      </span>
                    </div>
                  )}
                </div>
              </label>

              {/* Phone Pe */}
              <label
                className={`flex items-start gap-4 p-4 border-2 rounded cursor-pointer transition ${paymentMethod === "phonepe" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="phonepe"
                  checked={paymentMethod === "phonepe"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 mt-1 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-sm">PhonePe Payment Gateway (UPI, Cards & NetBanking)</span>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label
                className={`flex items-start gap-4 p-4 border-2 rounded cursor-pointer transition ${paymentMethod === "cod" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 mt-1 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-sm">Cash on Delivery (COD)</span>
                </div>
              </label>
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <h2 className="text-lg md:text-xl font-serif font-bold mb-4">Billing address</h2>
            <div className="space-y-3">
              <label
                className={`flex items-center gap-4 p-4 border-2 rounded cursor-pointer transition ${billingAddress === "same" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  name="billing"
                  value="same"
                  checked={billingAddress === "same"}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-sm">Same as shipping address</span>
              </label>

              <label
                className={`flex items-center gap-4 p-4 border-2 rounded cursor-pointer transition ${billingAddress === "different"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  name="billing"
                  value="different"
                  checked={billingAddress === "different"}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-sm">Use a different billing address</span>
              </label>
            </div>
          </div>

          {/* Pay Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition text-lg">
            Pay now
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 lg:sticky lg:top-24">
            <h3 className="font-serif text-lg font-bold mb-6">Order Summary</h3>

            {/* Product */}
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="relative flex-shrink-0">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <span className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-serif font-semibold text-sm mb-1">{item.name}</p>
                  <p className="text-xs text-gray-600 mb-1">
                    {item.color} / {item.birthstone}
                  </p>
                  <p className="text-xs text-gray-600">Initials: {item.initials}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹ {item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}

            {/* Discount Code */}
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                placeholder="Discount code"
                className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#a4ac86]"
              />
              <button className="px-4 py-2 text-gray-700 hover:text-black transition text-sm font-medium">
                Apply
              </button>
            </div>

            {/* Totals */}
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>₹ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-xs text-gray-500">Enter shipping address</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between font-serif font-bold text-lg">
                <span>Total</span>
                <span>
                  INR <span className="text-2xl">₹{total.toLocaleString()}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
