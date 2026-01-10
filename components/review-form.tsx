"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"

interface ReviewFormProps {
  productId?: string
  productName?: string
  onSuccess?: () => void
}

export function ReviewForm({ productId, productName, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append("rating", rating.toString())
    if (productId) formData.append("product_id", productId.replace(/[^a-zA-Z0-9-_]/g, ''))
    if (productName) formData.append("product_name", productName.substring(0, 200))
    if (imageUrl && /^https?:\/\/.+/.test(imageUrl)) formData.append("image_url", imageUrl)

    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        body: formData
      })
      
      if (res.ok) {
        e.currentTarget.reset()
        setRating(5)
        setImageUrl("")
        onSuccess?.()
        alert("Review submitted! It will be visible after approval.")
      }
    } catch (error) {
      alert("Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border">
      <h3 className="text-xl font-bold">Write a Review</h3>
      
      <div>
        <Label>Your Name</Label>
        <Input name="name" required placeholder="Enter your name" maxLength={100} />
      </div>

      <div>
        <Label>Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Your Review</Label>
        <Textarea name="comment" required placeholder="Share your experience..." rows={4} maxLength={1000} />
      </div>

      <div>
        <Label>Add Photo (Optional)</Label>
        <ImageUpload value={imageUrl} onChange={setImageUrl} folder="reviews" />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
