import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { delCache, delPattern, incrVersion } from "@/lib/cache/redis"
import { CacheKeys, versionKey } from "@/lib/cache/keyBuilder"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, type, id, category, tag } = body

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    switch (type) {
      case "product":
        if (id) {
          await delCache(`${CacheKeys.PRODUCT}:${id}`)
          await delCache(`${CacheKeys.INVENTORY}:${id}`)
          revalidatePath(`/products/${id}`)
        }
        break

      case "category":
        if (category) {
          await delPattern(`${CacheKeys.CATEGORY}:${category}*`)
          revalidatePath(`/products?category=${category}`)
        }
        break

      case "search":
        await incrVersion(versionKey(CacheKeys.SEARCH))
        await delPattern(`${CacheKeys.SEARCH}:*`)
        revalidateTag("search")
        break

      case "facets":
        await delPattern(`${CacheKeys.FACETS}*`)
        break

      case "trending":
        await delCache(`${CacheKeys.TRENDING}:products`)
        break

      case "global":
        await incrVersion(versionKey("global"))
        await delPattern("*")
        revalidatePath("/", "layout")
        break

      case "tag":
        if (tag) {
          revalidateTag(tag)
        }
        break

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    return NextResponse.json({
      revalidated: true,
      type,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[REVALIDATE] Error:", error)
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 })
  }
}
