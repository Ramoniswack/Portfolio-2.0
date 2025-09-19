"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

interface SectionWaveTransitionProps {
  colorScheme: 'blue' | 'purple' | 'emerald' | 'orange' | 'pink'
  direction?: 'up' | 'down'
  intensity?: 'light' | 'medium' | 'strong'
}

// Toggle to disable section-level wave/reveal animations globally
const DISABLE_ANIMATIONS = true

export function SectionWaveTransition({ 
  colorScheme, 
  direction = 'up', 
  intensity = 'medium' 
}: SectionWaveTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const colorSchemes = {
    blue: {
      gradient1: 'from-blue-100/30 via-blue-200/20 to-blue-300/10',
      gradient2: 'from-blue-200/25 via-blue-300/15 to-blue-100/20',
      gradient3: 'from-blue-50/35 via-blue-100/25 to-blue-200/15'
    },
    purple: {
      gradient1: 'from-purple-100/30 via-purple-200/20 to-purple-300/10',
      gradient2: 'from-purple-200/25 via-purple-300/15 to-purple-100/20',
      gradient3: 'from-purple-50/35 via-purple-100/25 to-purple-200/15'
    },
    emerald: {
      gradient1: 'from-emerald-100/30 via-emerald-200/20 to-emerald-300/10',
      gradient2: 'from-emerald-200/25 via-emerald-300/15 to-emerald-100/20',
      gradient3: 'from-emerald-50/35 via-emerald-100/25 to-emerald-200/15'
    },
    orange: {
      gradient1: 'from-orange-100/30 via-orange-200/20 to-orange-300/10',
      gradient2: 'from-orange-200/25 via-orange-300/15 to-orange-100/20',
      gradient3: 'from-orange-50/35 via-orange-100/25 to-orange-200/15'
    },
    pink: {
      gradient1: 'from-pink-100/30 via-pink-200/20 to-pink-300/10',
      gradient2: 'from-pink-200/25 via-pink-300/15 to-pink-100/20',
      gradient3: 'from-pink-50/35 via-pink-100/25 to-pink-200/15'
    }
  }

  useEffect(() => {
    if (!containerRef.current) return

    // If animations are disabled globally, do nothing
    if (DISABLE_ANIMATIONS) return

    try {
      const shown = sessionStorage.getItem('waveShown')
      if (shown) return
    } catch (e) {
      // ignore
    }

    gsap.registerPlugin(ScrollTrigger)

    const waves = containerRef.current.querySelectorAll('.section-wave')
    
    waves.forEach((wave, index) => {
      gsap.fromTo(wave, 
        {
          y: direction === 'up' ? 100 : -100,
          opacity: 0,
          scale: 0.8,
          rotate: direction === 'up' ? -5 : 5
        },
        {
          y: 0,
          opacity: intensity === 'light' ? 0.3 : intensity === 'medium' ? 0.5 : 0.7,
          scale: 1,
          rotate: 0,
          duration: 1.5,
          delay: index * 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )
  })
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [direction, intensity])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className={`section-wave absolute -bottom-20 -left-32 w-96 h-96 bg-gradient-to-r ${colorSchemes[colorScheme].gradient1} rounded-full blur-3xl`} />
      <div className={`section-wave absolute -bottom-32 -right-20 w-80 h-80 bg-gradient-to-l ${colorSchemes[colorScheme].gradient2} rounded-full blur-2xl`} />
      <div className={`section-wave absolute -top-16 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-gradient-to-b ${colorSchemes[colorScheme].gradient3} rounded-full blur-3xl`} />
    </div>
  )
}
