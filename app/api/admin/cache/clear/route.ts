import { NextRequest, NextResponse } from "next/server";
import { delPattern } from "@/lib/cache/redis";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    switch (type) {
      case "products":
        await delPattern("products:*");
        break;
      case "categories":
        await delPattern("categories:*");
        break;
      case "search":
        await delPattern("search:*");
        break;
      case "all":
        await delPattern("*");
        break;
      default:
        return NextResponse.json({ error: "Invalid cache type" }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Cache clear requested (Redis disabled - no-op)" 
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 });
  }
}
