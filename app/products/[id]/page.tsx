import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductDetailClient } from "./product-detail-client"

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} | Strevo Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image_url],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!product) {
    notFound()
  }

  let { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4)
  
  if (!relatedProducts?.length) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .neq("id", product.id)
      .limit(4)
    relatedProducts = data
  }
  
  const { data: additionalImages } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", product.id)
    .order("display_order")
  
  const allImages = [product.image_url, ...(additionalImages?.map(img => img.image_url) || [])].filter(Boolean)

  return (
    <ProductDetailClient product={product} allImages={allImages} relatedProducts={relatedProducts || []} />
  )
}
