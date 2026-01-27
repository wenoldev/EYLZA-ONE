import { CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function OrderConfirmation() {
  return (
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-50 p-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Thank you for your order!</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Your order was automatically placed in the queue and is being processed.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-6 md:p-8 mb-8">
          <h2 className="font-serif text-xl font-bold mb-6">Order Details</h2>

          <div className="grid grid-cols-2 gap-6 md:gap-8">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Order Number</p>
              <p className="text-lg md:text-xl font-semibold">123456789</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Order Date</p>
              <p className="text-lg md:text-xl font-semibold">December 14, 2023</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</p>
              <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                Processing
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total</p>
              <p className="text-lg md:text-xl font-semibold">₹ 1,502.00</p>
            </div>
          </div>
        </div>

        {/* Return to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-block bg-[#a4ac86] hover:bg-[#959d7a] text-white font-semibold py-3 px-8 rounded transition"
          >
            Return to Homepage
          </Link>
        </div>
      </main>
  )
}
