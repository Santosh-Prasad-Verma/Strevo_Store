import { NextRequest, NextResponse } from "next/server"
import { getPersonalizedProducts } from "@/lib/actions/analytics"

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId")
  if (!userId) return NextResponse.json({ products: [] })

  const products = await getPersonalizedProducts(userId)
  return NextResponse.json({ products })
}
