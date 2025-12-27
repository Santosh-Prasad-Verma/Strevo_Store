import { getUserOrders } from "@/lib/actions/orders"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Package } from "lucide-react"

export default async function OrdersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/orders")
  }

  const orders = await getUserOrders()

  return (
    <div className="min-h-screen bg-white">
      <div className="px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-medium tracking-widest uppercase mb-2">My Orders</h1>
              <p className="text-gray-500 text-sm tracking-wide">View and track your order history</p>
            </div>
            <Link href="/profile">
              <Button
                variant="outline"
                className="border-black text-black hover:bg-gray-100 text-xs font-medium tracking-widest uppercase bg-transparent"
              >
                Back to Profile
              </Button>
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg mb-6">You haven't placed any orders yet</p>
              <Link href="/">
                <Button className="bg-black text-white hover:bg-gray-800 text-xs font-medium tracking-widest uppercase px-8 py-3">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border-2 border-gray-200 p-6 hover:border-black transition-colors">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Order Number</p>
                      <p className="font-mono font-medium">{order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Date Placed</p>
                      <p className="font-mono">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="font-medium">{formatCurrency(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Status</p>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <Link href={`/orders/${order.id}`}>
                      <Button
                        variant="outline"
                        className="w-full md:w-auto border-black text-black hover:bg-black hover:text-white text-xs font-medium tracking-widest uppercase bg-transparent"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
