import { NextRequest, NextResponse } from "next/server"

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(request: NextRequest, maxRequests = 5, windowMs = 60000) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return null
  }

  if (record.count >= maxRequests) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  record.count++
  return null
}
