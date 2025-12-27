import { isAdmin, getAllProducts } from "@/lib/actions/admin"
import { redirect } from "next/navigation"
import { AdminProductsClient } from "./admin-products-client"

export default async function AdminProductsPage() {
  const adminStatus = await isAdmin()

  if (!adminStatus) {
    redirect("/")
  }

  const products = await getAllProducts()

  return <AdminProductsClient initialProducts={products} />
}
