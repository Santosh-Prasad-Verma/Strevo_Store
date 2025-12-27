"use client"

import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SocialShareProps {
  productId?: string
  productName: string
  productImage?: string
  url?: string
}

export function SocialShare({ productId, productName, productImage, url }: SocialShareProps) {
  const shareUrl = url || window.location.href
  const text = `Check out ${productName} on Strevo!`

  const trackShare = async (platform: string) => {
    if (productId) {
      await fetch("/api/social-shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, platform, shareUrl })
      }).catch(() => {})
    }
  }

  const shareToWhatsApp = () => {
    trackShare("whatsapp")
    window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`, "_blank")
  }

  const shareToFacebook = () => {
    trackShare("facebook")
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  const shareToTwitter = () => {
    trackShare("twitter")
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  const copyLink = () => {
    trackShare("copy")
    navigator.clipboard.writeText(shareUrl)
    alert("Link copied!")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={shareToWhatsApp}>
          <span className="mr-2">📱</span> WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToFacebook}>
          <span className="mr-2">👍</span> Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToTwitter}>
          <span className="mr-2">🐦</span> Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyLink}>
          <span className="mr-2">🔗</span> Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
