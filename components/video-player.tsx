"use client"

interface VideoPlayerProps {
  src: string
  poster?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  className?: string
}

export function VideoPlayer({ 
  src, 
  poster, 
  autoPlay = false, 
  loop = false, 
  muted = true,
  controls = true,
  className = ""
}: VideoPlayerProps) {
  return (
    <video
      src={src}
      poster={poster}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={controls}
      playsInline
      className={className}
    >
      Your browser does not support the video tag.
    </video>
  )
}
