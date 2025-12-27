import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { CurtainLayout } from "@/components/curtain-layout"
import { CurtainFooter } from "@/components/curtain-footer"
import { Navbar } from "@/components/navigation/navbar"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Strevo Store",
  description: "Technical sportswear designed for precision.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <CurtainLayout
          footer={<CurtainFooter />}
        >
          <Navbar />
          <main className="flex-1">{children}</main>
        </CurtainLayout>
      </body>
    </html>
  )
}