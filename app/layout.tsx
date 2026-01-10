import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { ConditionalLayout } from "@/components/conditional-layout"
import AnalyticsProvider from "@/components/analytics-provider"
import { AuthProvider } from "@/components/providers/AuthProvider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Strevo Store",
  description: "Technical sportswear designed for precision.",
  keywords: ["streetwear", "fashion", "clothing", "india", "online shopping"],
  authors: [{ name: "Strevo" }],
  openGraph: {
    title: "Strevo Store",
    description: "Technical sportswear designed for precision.",
    url: "https://strevo.com",
    siteName: "Strevo Store",
    images: [{ url: "https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/og-image.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strevo Store",
    description: "Technical sportswear designed for precision.",
  },
  icons: {
    icon: "/Strevo_store_logo.jpg",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <AnalyticsProvider />
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
