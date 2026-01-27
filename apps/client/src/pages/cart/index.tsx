import { Link } from "react-router-dom"
import { Trash2 } from "lucide-react"

const cartItems = [
  {
    id: 1,
    name: "Initials Birthstone Necklace",
    price: 1499,
    image: "/images/image.png",
    color: "Silver",
    birthstone: "January - Garnet (6 mm)",
    initials: "W",
    quantity: 1,
  },
]

export default function Cart() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + tax

  return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold">Your cart</h1>
          <Link to="/products" className="text-sm text-gray-600 hover:text-black underline md:no-underline">
            Continue shopping
          </Link>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-8">
              {/* Column Headers */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200">
                <div className="col-span-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</div>
                <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">
                  Quantity
                </div>
                <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">
                  Total
                </div>
              </div>

              {/* Cart Item */}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="md:grid md:grid-cols-12 md:gap-4 md:items-start pb-8 border-b border-gray-200 last:border-b-0"
                >
                  {/* Image */}
                  <div className="col-span-5 mb-4 md:mb-0">
                    <div className="flex gap-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-24 h-24 md:w-32 md:h-32 object-cover bg-gray-100"
                      />
                      <div className="flex-1 md:hidden">
                        <h3 className="font-serif text-sm md:text-base font-semibold mb-2">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">₹ {item.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Color: {item.color}</p>
                        <p className="text-xs text-gray-500">BirthStone: {item.birthstone}</p>
                        <p className="text-xs text-gray-500">Initials: {item.initials}</p>
                      </div>
                    </div>
                  </div>

                  {/* Product Info (desktop only) */}
                  <div className="hidden md:block col-span-5">
                    <h3 className="font-serif font-semibold mb-3">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">₹ {item.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Color: {item.color}</p>
                    <p className="text-xs text-gray-500">BirthStone: {item.birthstone}</p>
                    <p className="text-xs text-gray-500">Initials: {item.initials}</p>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-3 flex items-center gap-3 mb-4 md:mb-0 md:justify-center">
                    <button className="border border-gray-300 w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition">
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      className="w-12 text-center border border-gray-300 py-1 focus:outline-none"
                      readOnly
                    />
                    <button className="border border-gray-300 w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition">
                      +
                    </button>
                    <button className="ml-2 text-gray-400 hover:text-red-600 transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Total */}
                  <div className="col-span-4 md:text-right">
                    <p className="text-base font-semibold">₹ {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 lg:sticky lg:top-24">
                <h3 className="font-serif text-lg font-bold mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes and shipping</span>
                    <span className="text-xs text-gray-500">Calculated at checkout</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between font-serif font-bold text-lg">
                    <span>Total</span>
                    <span>₹ {total.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full bg-[#a4ac86] hover:bg-[#959d7a] text-white font-medium py-3 px-4 rounded transition text-center block"
                >
                  Check out
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block bg-[#a4ac86] text-white px-6 py-2 rounded hover:bg-[#959d7a] transition"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </main>
  )
}
