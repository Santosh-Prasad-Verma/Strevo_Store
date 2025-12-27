import { getOrders } from "@/lib/actions/admin/orders"
import { OrdersClient } from "./orders-client"
import { requireAdmin } from "@/lib/auth/admin-guard"

export default async function AdminOrdersPage() {
  await requireAdmin()
  const { orders, total, totalPages } = await getOrders({ page: 1, pageSize: 20 })

  return <OrdersClient initialOrders={orders} initialTotal={total} initialTotalPages={totalPages} />
}
