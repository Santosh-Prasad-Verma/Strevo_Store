"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"

interface Props {
  images: string[]
}

export function Product360View({ images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const next = () => setCurrentIndex((i) => (i + 1) % images.length)
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length)

  return (
    <>
      <div className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden group">
        <Image src={images[currentIndex]} alt="Product view" fill className="object-cover" />
        
        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
          <ChevronRight className="w-5 h-5" />
        </button>
        
        <button onClick={() => setIsFullscreen(true)} className="absolute top-2 right-2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
          <Maximize2 className="w-5 h-5" />
        </button>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrentIndex(i)} className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`} />
          ))}
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center" onClick={() => setIsFullscreen(false)}>
          <Image src={images[currentIndex]} alt="Product view" fill className="object-contain" />
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-3 rounded-full">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-3 rounded-full">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
    </>
  )
}
