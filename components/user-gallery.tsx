"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Heart, Instagram, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/admin/image-upload"

export function UserGallery() {
  const [content, setContent] = useState<any[]>([])
  const [imageUrl, setImageUrl] = useState("")
  const [caption, setCaption] = useState("")
  const [instagramHandle, setInstagramHandle] = useState("")

  useEffect(() => {
    fetch("/api/user-content")
      .then(r => r.json())
      .then(data => setContent(data.content || []))
  }, [])

  const handleSubmit = async () => {
    await fetch("/api/user-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, caption, instagramHandle })
    })
    setImageUrl("")
    setCaption("")
    setInstagramHandle("")
    alert("Photo submitted for review!")
  }

  const handleLike = async (id: number) => {
    await fetch(`/api/user-content/${id}/like`, { method: "POST" })
    setContent(content.map(c => c.id === id ? {...c, likes_count: c.likes_count + 1} : c))
  }

  return (
    <section className="py-20 px-4 md:px-8 bg-neutral-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold uppercase mb-2">#StrevoStyle</h2>
            <p className="text-neutral-600">Share your style with the community</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Upload className="w-4 h-4" />
                Share Your Look
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Style</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <ImageUpload value={imageUrl} onChange={setImageUrl} folder="user-content" />
                <Textarea 
                  placeholder="Tell us about your outfit..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <Input 
                  placeholder="@your_instagram (optional)"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                />
                <Button onClick={handleSubmit} className="w-full">Submit</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {content.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-200">
              <Image src={item.image_url} alt={item.caption} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  {item.caption && <p className="text-sm mb-2">{item.caption}</p>}
                  <div className="flex items-center justify-between">
                    {item.instagram_handle && (
                      <div className="flex items-center gap-1 text-xs">
                        <Instagram className="w-3 h-3" />
                        <span>{item.instagram_handle}</span>
                      </div>
                    )}
                    <button onClick={() => handleLike(item.id)} className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{item.likes_count}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
