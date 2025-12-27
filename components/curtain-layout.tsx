"use client"

import { useEffect, useRef } from "react"

interface CurtainLayoutProps {
  children: React.ReactNode
  footer: React.ReactNode
}

export function CurtainLayout({ children, footer }: CurtainLayoutProps) {
  const mainContentRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const updateFooterHeight = () => {
      if (mainContentRef.current && footerRef.current) {
        const footerHeight = footerRef.current.offsetHeight
        mainContentRef.current.style.marginBottom = `${footerHeight}px`
        footerRef.current.classList.add('is-ready')
      }
    }

    // Update on load and resize
    updateFooterHeight()
    window.addEventListener('resize', updateFooterHeight)

    // Intersection Observer for footer animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && footerRef.current) {
          footerRef.current.classList.add('in-view')
        }
      },
      { threshold: 0.1 }
    )

    const trigger = document.getElementById('footer-trigger')
    if (trigger) {
      observer.observe(trigger)
    }

    return () => {
      window.removeEventListener('resize', updateFooterHeight)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        #main-content {
          position: relative;
          z-index: 10;
          background-color: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          transition: margin-bottom 0.1s ease-out;
        }

        #curtain-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: auto;
          z-index: 0;
          visibility: hidden;
        }

        #curtain-footer.is-ready {
          visibility: visible;
        }

        .anim-element {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .anim-element:nth-child(1) { transition-delay: 0.1s; }
        .anim-element:nth-child(2) { transition-delay: 0.2s; }
        .anim-element:nth-child(3) { transition-delay: 0.3s; }
        .anim-element:nth-child(4) { transition-delay: 0.4s; }

        #curtain-footer.in-view .anim-element {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div id="main-content" ref={mainContentRef}>
        {children}
        <div id="footer-trigger" className="h-1 w-full"></div>
      </div>

      <footer id="curtain-footer" ref={footerRef}>
        {footer}
      </footer>
    </>
  )
}