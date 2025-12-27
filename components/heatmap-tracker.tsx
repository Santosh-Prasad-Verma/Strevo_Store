"use client"

import { useEffect } from "react"

export function HeatmapTracker() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      fetch("/api/heatmap/track", {
        method: "POST",
        body: JSON.stringify({
          pageUrl: window.location.pathname,
          x: e.clientX,
          y: e.clientY,
          element: target.tagName
        })
      })
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return null
}
