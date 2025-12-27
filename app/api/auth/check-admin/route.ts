import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/actions/admin"

export async function GET() {
  const adminStatus = await isAdmin()
  return NextResponse.json({ isAdmin: adminStatus })
}
