import { getOrderById } from "@/lib/actions/orders"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { ImageWithLoading } from "@/components/image-with-loading"
import { ArrowLeft, MapPin, CreditCard, Package, Truck, CheckCircle, Clock } from "lucide-react"

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/orders/${params.id}`)
  }

  const order = await getOrderById(params.id)

  if (!order) {
    redirect("/orders")
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Link
              href="/orders"
              className="inline-flex items-center text-gray-500 hover:text-black mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-xs font-medium tracking-widest uppercase">Back to Orders</span>
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-3xl font-medium tracking-widest uppercase">Order {order.order_number}</h1>
              <span
                className={`px-4 py-2 text-sm font-medium uppercase tracking-wider ${
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
            <p className="text-gray-500 text-sm tracking-wide mt-2">
              Placed on {new Date(order.created_at).toLocaleDateString()} at{" "}
              {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Order Status Timeline */}
              <div className="border-2 border-black p-6">
                <h2 className="text-xl font-medium tracking-widest uppercase mb-6">Order Status</h2>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-6">
                    {/* Processing */}
                    <div className="relative flex items-start gap-4">
                      <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        order.status === "processing" || order.status === "shipped" || order.status === "delivered"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-medium text-sm uppercase tracking-wide">Order Placed</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Shipped */}
                    <div className="relative flex items-start gap-4">
                      <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        order.status === "shipped" || order.status === "delivered"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-medium text-sm uppercase tracking-wide">Shipped</p>
                        {order.shipped_at ? (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.shipped_at).toLocaleDateString()} at {new Date(order.shipped_at).toLocaleTimeString()}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1">Pending</p>
                        )}
                        {order.tracking_number && (
                          <p className="text-xs text-gray-600 mt-1">
                            Tracking: <span className="font-mono">{order.tracking_number}</span>
                          </p>
                        )}
                        {order.carrier && (
                          <p className="text-xs text-gray-600">Carrier: {order.carrier}</p>
                        )}
                      </div>
                    </div>

                    {/* Delivered */}
                    <div className="relative flex items-start gap-4">
                      <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        order.status === "delivered"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-medium text-sm uppercase tracking-wide">Delivered</p>
                        {order.status === "delivered" ? (
                          <p className="text-xs text-gray-500 mt-1">Order completed</p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1">Pending</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-2 border-black p-6">
                <h2 className="text-xl font-medium tracking-widest uppercase mb-6">Items</h2>
                <div className="space-y-6">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 flex-shrink-0 border border-gray-200 p-2">
                        <ImageWithLoading
                          src={item.product_image_url || "/placeholder.svg"}
                          alt={item.product_name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium tracking-wide">{item.product_name}</h3>
                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">{formatCurrency(item.total_price)}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{formatCurrency(item.unit_price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
              <div className="border-2 border-gray-200 p-6">
                <h2 className="text-lg font-medium tracking-widest uppercase mb-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Shipping Address
                </h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-black">{order.shipping_full_name}</p>
                  <p>{order.shipping_address_line1}</p>
                  {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                  <p>
                    {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                  </p>
                  <p>{order.shipping_country}</p>
                  <p className="mt-2">{order.shipping_phone}</p>
                </div>
              </div>

              <div className="border-2 border-gray-200 p-6">
                <h2 className="text-lg font-medium tracking-widest uppercase mb-4 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Order Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{formatCurrency(order.shipping_cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
