"use client"

import { useEffect, useState } from "react"

interface LoadingScreenProps {
  onComplete?: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [counter, setCounter] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [shouldShow, setShouldShow] = useState(true)

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden"

    // Animate counter from 0 to 100
    const duration = 2500
    const startTime = Date.now()
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCounter(Math.floor(eased * 100))

      if (progress >= 1) {
        clearInterval(interval)
        // Trigger reveal animation
        setTimeout(() => {
          setIsLoaded(true)
          // Hide loading screen and restore scroll
          setTimeout(() => {
            setShouldShow(false)
            document.body.style.overflow = "auto"
            onComplete?.()
          }, 1500)
        }, 200)
      }
    }, 16)

    // Cleanup
    return () => {
      clearInterval(interval)
      document.body.style.overflow = "auto"
    }
  }, [onComplete])

  if (!shouldShow) return null

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Top Panel */}
      <div
        className="absolute top-0 left-0 w-full h-1/2 bg-black text-white overflow-hidden border-b border-white/10 transition-transform duration-[1500ms]"
        style={{
          transform: isLoaded ? "translateY(-100%)" : "translateY(0)",
          transitionTimingFunction: "cubic-bezier(0.87, 0, 0.13, 1)",
        }}
      >
        <div className="p-8 md:p-12 h-full flex flex-col justify-start">
          <div className="w-full flex justify-between items-start">
            <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-light opacity-60">Strevo</div>
            <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-light opacity-60">Loading Experience</div>
          </div>
        </div>
        
        {/* Split Text Top Half */}
        <div className="absolute left-1/2 bottom-0 w-full text-center" style={{ transform: "translate(-50%, 50%)" }}>
          <h1 className="font-serif text-[13vw] leading-none italic tracking-tighter text-white/20 select-none">Strevo</h1>
        </div>
      </div>

      {/* Bottom Panel */}
      <div
        className="absolute bottom-0 left-0 w-full h-1/2 bg-black text-white overflow-hidden border-t border-white/10 transition-transform duration-[1500ms]"
        style={{
          transform: isLoaded ? "translateY(100%)" : "translateY(0)",
          transitionTimingFunction: "cubic-bezier(0.87, 0, 0.13, 1)",
        }}
      >
        {/* Split Text Bottom Half */}
        <div className="absolute left-1/2 top-0 w-full text-center" style={{ transform: "translate(-50%, -50%)" }}>
          <h1 className="font-serif text-[13vw] leading-none italic tracking-tighter text-white/20 select-none">Strevo</h1>
        </div>

        <div className="p-8 md:p-12 h-full flex flex-col justify-end">
          <div className="w-full flex justify-end mb-8">
            <div className="text-[18vw] md:text-[14rem] leading-[0.8] font-serif font-medium tracking-tighter tabular-nums">
              {counter}
            </div>
          </div>
          
          <div className="w-full">
            <div className="w-full h-[1px] bg-white/15 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-white transition-all duration-75" style={{ width: `${counter}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
