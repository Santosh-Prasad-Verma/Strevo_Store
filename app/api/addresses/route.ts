import { NextResponse } from "next/server"
import { getAddresses } from "@/lib/actions/addresses"

export async function GET() {
  try {
    const addresses = await getAddresses()
    return NextResponse.json(addresses)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 })
  }
}
