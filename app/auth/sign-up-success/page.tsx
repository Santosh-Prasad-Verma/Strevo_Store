import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-white">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center mb-4">
            <img src="/acme-logo.png" alt="BANANA SPORTSWEAR" className="h-12 w-auto" />
          </div>

          <Card className="border-2 border-black">
            <CardHeader>
              <CardTitle className="text-2xl tracking-wide">Check Your Email</CardTitle>
              <CardDescription className="tracking-wide">
                We&apos;ve sent you a confirmation link to verify your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 tracking-wide">
                Please click the link in the email to complete your registration and activate your account.
              </p>
              <p className="text-sm text-gray-600 tracking-wide">
                Once confirmed, you&apos;ll be able to log in and start shopping!
              </p>
              <Link href="/auth/login">
                <Button className="w-full bg-black text-white hover:bg-gray-800 text-xs font-medium tracking-widest uppercase">
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
