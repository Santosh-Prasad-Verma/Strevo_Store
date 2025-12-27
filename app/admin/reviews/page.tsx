"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, ThumbsUp } from "lucide-react"
import Image from "next/image"

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews")
      const data = await res.json()
      setReviews(data.reviews || [])
    } catch (error) {
      console.error("Failed to fetch reviews")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await fetch("/api/admin/reviews/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: id })
      })
      fetchReviews()
    } catch (error) {
      alert("Failed to approve review")
    }
  }

  const handleReject = async (id: number) => {
    if (!confirm("Are you sure you want to reject this review?")) return
    
    try {
      await fetch("/api/admin/reviews/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: id })
      })
      fetchReviews()
    } catch (error) {
      alert("Failed to reject review")
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Review Management</h1>
      
      {reviews.length === 0 ? (
        <p className="text-neutral-500">No pending reviews</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">{review.customer_name}</span>
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-yellow-500" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {review.products?.name && (
                    <p className="text-sm text-neutral-500 mb-2">Product: {review.products.name}</p>
                  )}
                  {review.product_name && !review.products?.name && (
                    <p className="text-sm text-neutral-500 mb-2">Product: {review.product_name}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm">{review.helpful_count || 0}</span>
                </div>
              </div>

              <p className="text-neutral-700 mb-4">{review.comment}</p>

              {review.image_url && (
                <div className="relative w-32 h-32 mb-4 rounded overflow-hidden">
                  <Image src={review.image_url} alt="Review" fill className="object-cover" />
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={() => handleApprove(review.id)} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-1" /> Approve
                </Button>
                <Button onClick={() => handleReject(review.id)} size="sm" variant="destructive">
                  <X className="w-4 h-4 mr-1" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
