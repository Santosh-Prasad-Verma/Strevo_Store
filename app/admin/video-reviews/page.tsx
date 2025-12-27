"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface VideoReview {
  id: string
  customer_name: string
  video_url: string
  product_id: string
  created_at: string
}

export default function AdminVideoReviews() {
  const [reviews, setReviews] = useState<VideoReview[]>([])

  useEffect(() => {
    fetch("/api/admin/video-reviews")
      .then(r => r.json())
      .then(data => setReviews(data.reviews || []))
  }, [])

  const approve = async (id: string) => {
    await fetch("/api/admin/video-reviews/approve", {
      method: "POST",
      body: JSON.stringify({ reviewId: id })
    })
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  const reject = async (id: string) => {
    await fetch("/api/admin/video-reviews/reject", {
      method: "POST",
      body: JSON.stringify({ reviewId: id })
    })
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Pending Video Reviews</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map(review => (
          <div key={review.id} className="border rounded-lg p-4">
            <video src={review.video_url} controls className="w-full aspect-video rounded mb-4" />
            <p className="font-semibold mb-2">{review.customer_name}</p>
            <p className="text-sm text-neutral-500 mb-4">{new Date(review.created_at).toLocaleDateString()}</p>
            <div className="flex gap-2">
              <Button onClick={() => approve(review.id)} size="sm">Approve</Button>
              <Button onClick={() => reject(review.id)} variant="destructive" size="sm">Reject</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
