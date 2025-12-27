import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export function EmptyCart() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-neutral-300" strokeWidth={1} />
        <h2 className="text-2xl font-bold mb-2">Your bag is empty</h2>
        <p className="text-neutral-600 mb-8">Add items you like to your bag to shop later.</p>
        <Link
          href="/products"
          className="inline-block bg-black text-white px-8 py-3 rounded font-medium hover:bg-neutral-800"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
