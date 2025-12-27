import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCache, setCache } from "@/lib/cache/redis.prod"
import { productKey, CacheTTL } from "@/lib/cache/keyBuilder.prod"
import { setCacheHeaders, CacheHeaders } from "@/lib/cache/headers.prod"

export const revalidate = 60

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const cacheKey = productKey(id)

  try {
    const cached = await getCache<any>(cacheKey)
    if (cached) {
      const response = NextResponse.json({ ...cached, cached: true })
      setCacheHeaders(response.headers, CacheHeaders.PRODUCT)
      return response
    }

    const supabase = await createClient()
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single()

    if (error || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const { data: images } = await supabase
      .from("product_images")
      .select("image_url")
      .eq("product_id", id)
      .order("display_order")

    const result = {
      product,
      images: images?.map((img) => img.image_url) || [],
    }

    await setCache(cacheKey, result, CacheTTL.PRODUCT)

    const response = NextResponse.json({ ...result, cached: false })
    setCacheHeaders(response.headers, CacheHeaders.PRODUCT)
    return response
  } catch (error) {
    console.error("[PRODUCT] Error:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
