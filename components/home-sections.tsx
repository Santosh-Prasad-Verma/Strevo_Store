"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Review {
  id: number
  customer_name: string
  rating: number
  comment: string
  product_name?: string
  image_url?: string
  helpful_count?: number
  products?: { name: string }
  created_at: string
}

export function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => setReviews(data.reviews || []))
      .catch(() => {})
  }, [])

  const displayReviews: Review[] = reviews.length > 0 ? reviews : [
    { id: 1, customer_name: "Rahul M.", rating: 5, comment: "Perfect oversized fit.", product_name: "Black Tee", created_at: '' },
    { id: 2, customer_name: "Priya S.", rating: 5, comment: "Quality feels premium.", product_name: "Cargo Pants", created_at: '' },
    { id: 3, customer_name: "Arjun K.", rating: 5, comment: "Best streetwear brand.", product_name: "Denim Jacket", created_at: '' },
    { id: 4, customer_name: "Neha R.", rating: 5, comment: "Amazing quality!", product_name: "Hoodie", created_at: '' },
  ]

  const handleVote = async (reviewId: number) => {
    try {
      await fetch("/api/reviews/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId })
      })
      // Refresh reviews
      const res = await fetch('/api/reviews')
      const data = await res.json()
      setReviews(data.reviews || [])
    } catch (error) {
      console.error("Failed to vote")
    }
  }

  return (
    <section className="bg-neutral-50 py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-3 text-black">Customer Reviews</h2>
          <div className="flex items-center justify-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
            <span className="ml-2 text-sm text-neutral-600">4.9/5</span>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex gap-6 animate-marquee" style={{ animationDuration: '25s' }}>
            {[...displayReviews, ...displayReviews].map((review, i) => (
              <div key={i} className="bg-white border border-neutral-200 p-6 min-w-[320px] flex-shrink-0 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-yellow-500" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                
                {review.image_url && (
                  <div className="relative w-full h-40 mb-3 rounded overflow-hidden">
                    <Image src={review.image_url} alt="Review" fill className="object-cover" />
                  </div>
                )}
                
                <p className="text-neutral-700 mb-4 line-clamp-3">{review.comment}</p>
                
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="font-semibold text-neutral-900">{review.customer_name}</span>
                  {(review.product_name || review.products?.name) && (
                    <span className="text-neutral-500 text-xs">{review.products?.name || review.product_name}</span>
                  )}
                </div>
                
                <button
                  onClick={() => handleVote(review.id)}
                  className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>Helpful ({review.helpful_count || 0})</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


export function InstagramSection() {
  return (
    <section className="bg-white py-24 px-4 md:px-8">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-6xl font-bold tracking-tight uppercase text-center mb-4 text-black">Follow @strevo.in</h2>
        <p className="text-center text-neutral-600 mb-12 md:text-0.5xl">Join our community on Instagram</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "/products/kisses_18.webp",
            "/products/fabric-closeup-black-cropped-top-psypher.webp",
            "/products/black-wide-leg-cargo-front.webp",
            "/products/grey-denim-streetwear-jacket-front-view.webp",
            "/products/psypher-black-corduroy-shirt-men-front-view.webp",
            "/products/brown-cropped-streetwear-top-front.webp"
          ].map((img, i) => (
            <Link key={i} href="https://instagram.com/strevo.in" target="_blank" className="group relative aspect-square overflow-hidden">
              <Image
                src={img}
                alt={`Instagram post ${i + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
