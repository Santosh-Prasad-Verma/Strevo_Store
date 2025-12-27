import { getOrderById } from "@/lib/actions/admin/orders"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OrderStatusUpdate } from "./order-status-update"
import { OrderTrackingForm } from "@/components/admin/order-tracking-form"
import { notFound } from "next/navigation"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  try {
    const { order, items } = await getOrderById(params.id)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Order {order.order_number}</h2>
            <p className="text-gray-600">Placed on {new Date(order.created_at).toLocaleString()}</p>
          </div>
          <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 rounded-none lg:col-span-2">
            <h3 className="font-bold mb-4">Order Items</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${item.total_price.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order.shipping_cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 rounded-none">
              <h3 className="font-bold mb-4">Customer</h3>
              <p className="font-medium">{order.shipping_full_name}</p>
              {order.shipping_phone && <p className="text-sm text-gray-600">{order.shipping_phone}</p>}
            </Card>

            <Card className="p-6 rounded-none">
              <h3 className="font-bold mb-4">Shipping Address</h3>
              <p className="text-sm">{order.shipping_address_line1}</p>
              {order.shipping_address_line2 && <p className="text-sm">{order.shipping_address_line2}</p>}
              <p className="text-sm">
                {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
              </p>
              <p className="text-sm">{order.shipping_country}</p>
            </Card>

            <Card className="p-6 rounded-none">
              <h3 className="font-bold mb-4">Payment</h3>
              <p className="text-sm">Method: {order.payment_method || "N/A"}</p>
              <p className="text-sm">Status: {order.payment_status}</p>
            </Card>

            <Card className="p-6 rounded-none">
              <h3 className="font-bold mb-4">Tracking Information</h3>
              <OrderTrackingForm 
                orderId={order.id} 
                currentTracking={order.tracking_number ?? undefined} 
                currentCarrier={order.carrier ?? undefined} 
              />
            </Card>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
