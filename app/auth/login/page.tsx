import { LoginForm } from '@/components/auth/login-form'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Sign In | Strevo',
  description: 'Sign in to your Strevo account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white">
        <LoginForm />
      </div>

      {/* Right - Hero Image (hidden on mobile) */}
      <div className="hidden lg:block lg:flex-1 relative bg-neutral-900">
        <Image
          src="https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/auth_img.jpeg"
          alt="Strevo technical performance wear"
          fill
          className="object-cover opacity-80"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12 text-white space-y-2">
          <p className="text-xs tracking-[0.3em] uppercase">System 01 / Essentials</p>
          <h2 className="text-4xl font-bold tracking-tight uppercase">
            Engineered for<br />the Modern Generation
          </h2>
        </div>
        <Link href="/" className="absolute top-8 left-8 text-white text-2xl font-bold tracking-wider">
          STREVO
        </Link>
      </div>
    </div>
  )
}
