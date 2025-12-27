"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}${redirect}`,
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError("Database connection failed. Please configure Supabase credentials in .env.local")
      } else {
        setError(error instanceof Error ? error.message : "An error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-white">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="relative h-16 w-16">
              <Image
                src="/Strevo_store_logo.jpg"
                alt="Strevo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold uppercase tracking-tighter">Strevo</h1>
          </div>

          <Card className="border-2 border-black">
            <CardHeader>
              <CardTitle className="text-2xl tracking-wide">Create Account</CardTitle>
              <CardDescription className="tracking-wide">Enter your details to create a new account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName" className="tracking-wide">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-2 border-gray-300 focus:border-black"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="tracking-wide">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-2 border-gray-300 focus:border-black"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="tracking-wide">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-2 border-gray-300 focus:border-black"
                    />
                    <p className="text-xs text-gray-500">Must be at least 6 characters</p>
                  </div>
                  {error && <p className="text-sm text-red-500 tracking-wide">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-800 text-xs font-medium tracking-widest uppercase"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm tracking-wide">
                  Already have an account?{" "}
                  <Link
                    href={`/auth/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
                    className="underline underline-offset-4 font-medium"
                  >
                    Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
