"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface WaveRevealProps {
  isActive: boolean
  onComplete: () => void
}

// Toggle this to true to fully disable the wave reveal animation.
const DISABLE_ANIMATIONS = true

export function WaveReveal({ isActive, onComplete }: WaveRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!isActive || !containerRef.current || !pathRef.current) return

    const container = containerRef.current

    // If animations are globally disabled, skip GSAP entirely but still
    // mark the wave as shown and call onComplete so callers aren't blocked.
    if (DISABLE_ANIMATIONS || prefersReducedMotion) {
      try { sessionStorage.setItem('waveShown', '1') } catch {}
      container.style.display = 'none'
      onComplete()
      return
    }

    const path = pathRef.current

    const tl = gsap.timeline({
      onComplete: () => {
        container.style.display = "none"
        try { sessionStorage.setItem('waveShown', '1') } catch {}
        onComplete()
      },
    })

    // Initial state - wave starts from bottom
    tl.set(container, { autoAlpha: 1 })
      .set(path, {
        attr: { d: "M0,100 Q25,100 50,100 T100,100 L100,100 L0,100 Z" },
        transformOrigin: "center bottom",
      })
      // Step 1: Wave rises with organic motion
      .to(path, {
        attr: { d: "M0,80 Q25,60 50,80 T100,70 L100,100 L0,100 Z" },
        duration: 0.8,
        ease: "power2.out",
      })
      // Step 2: Wave expands and morphs
      .to(path, {
        attr: { d: "M0,50 Q25,20 50,50 T100,30 L100,100 L0,100 Z" },
        duration: 0.6,
        ease: "power2.out",
      })
      // Step 3: Full coverage
      .to(path, {
        attr: { d: "M0,0 Q25,0 50,0 T100,0 L100,100 L0,100 Z" },
        duration: 0.5,
        ease: "power2.out",
      })
      // Step 4: Fade out to reveal page
      .to(container, {
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
      })

    return () => {
      tl.kill()
    }
  }, [isActive, onComplete, prefersReducedMotion])

  return (
    <div ref={containerRef} className="wave-reveal" style={{ opacity: 0 }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="50%" stopColor="var(--accent2)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>
        <path ref={pathRef} d="M0,100 Q25,100 50,100 T100,100 L100,100 L0,100 Z" fill="url(#waveGradient)" />
      </svg>
    </div>
  )
}
