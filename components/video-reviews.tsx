"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, ThumbsUp } from "lucide-react"

interface VideoReview {
  id: string
  customer_name: string
  video_url: string
  thumbnail_url: string
  likes: number
  created_at: string
}

export function VideoReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<VideoReview[]>([])
  const [playing, setPlaying] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/reviews/video?productId=${productId}`)
      .then(r => r.json())
      .then(data => setReviews(data.reviews || []))
  }, [productId])

  const likeVideo = async (id: string) => {
    await fetch("/api/reviews/video/like", {
      method: "POST",
      body: JSON.stringify({ reviewId: id })
    })
    setReviews(prev => prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Video Reviews</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {reviews.map(review => (
          <div key={review.id} className="relative aspect-video bg-neutral-100 rounded-lg overflow-hidden group">
            {playing === review.id ? (
              <video src={review.video_url} controls autoPlay className="w-full h-full" />
            ) : (
              <>
                <img src={review.thumbnail_url} alt="Video thumbnail" className="w-full h-full object-cover" />
                <button onClick={() => setPlaying(review.id)} className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition">
                  <Play className="w-12 h-12 text-white" />
                </button>
              </>
            )}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-sm">
              <span>{review.customer_name}</span>
              <button onClick={() => likeVideo(review.id)} className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{review.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function VideoReviewUpload({ productId }: { productId: string }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("productId", productId)

    await fetch("/api/reviews/video/upload", {
      method: "POST",
      body: formData
    })
    setUploading(false)
  }

  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center">
      <input type="file" accept="video/*" onChange={handleUpload} className="hidden" id="video-upload" />
      <label htmlFor="video-upload">
        <Button disabled={uploading} asChild>
          <span>{uploading ? "Uploading..." : "Upload Video Review"}</span>
        </Button>
      </label>
      <p className="text-sm text-neutral-500 mt-2">Max 60 seconds, MP4 format</p>
    </div>
  )
}
