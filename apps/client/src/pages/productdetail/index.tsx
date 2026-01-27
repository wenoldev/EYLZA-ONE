import { Link, useParams } from "react-router-dom"
import { ArrowLeft, ShoppingCart } from "lucide-react"
const PRODUCTS: Record<number, any> = {
  1: {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    image: "/wireless-headphones.png",
    category: "Electronics",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
    specs: ["Noise Cancellation", "30h Battery", "Bluetooth 5.0", "Built-in Microphone"],
    inStock: true,
  },
  2: {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    image: "/smartwatch-lifestyle.png",
    category: "Electronics",
    description: "Feature-rich smartwatch with health tracking and notifications.",
    specs: ["Heart Rate Monitor", "Sleep Tracking", "Water Resistant", "5-day Battery"],
    inStock: true,
  },
  3: {
    id: 3,
    name: "Premium Backpack",
    price: 79.99,
    image: "/premium-backpack.jpg",
    category: "Accessories",
    description: "Durable and spacious backpack perfect for travel and daily use.",
    specs: ["Waterproof", "USB Charging Port", "Laptop Compartment", "30L Capacity"],
    inStock: true,
  },
}

export default function ProductDetail() {
  const { id } = useParams()
  const product = PRODUCTS[Number(id)]

  if (!product) {
    return (
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link to="/products" className="text-accent hover:underline mt-4 inline-block">
            Back to products
          </Link>
        </main>
    )
  }

  return (
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/products"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div>
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full rounded-lg border border-border"
              />
            </div>

            {/* Details */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-4xl font-bold text-accent mb-4">${product.price.toFixed(2)}</p>
              <p className="text-foreground mb-6">{product.description}</p>

              {/* Specs */}
              <div className="mb-8">
                <h3 className="font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.specs.map((spec: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="px-6 py-3 border border-border rounded-lg hover:bg-secondary transition">
                  Save for Later
                </button>
              </div>

              {product.inStock ? (
                <p className="text-green-600 text-sm mt-4">✓ In Stock</p>
              ) : (
                <p className="text-destructive text-sm mt-4">Out of Stock</p>
              )}
            </div>
          </div>
        </div>
      </main>
  )
}
