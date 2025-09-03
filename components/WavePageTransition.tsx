"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

interface WavePageTransitionProps {
  isActive: boolean
  direction?: 'enter' | 'exit'
  colorScheme?: 'blue' | 'purple' | 'emerald' | 'orange' | 'pink'
  onComplete?: () => void
}

export function WavePageTransition({ 
  isActive, 
  direction = 'enter', 
  colorScheme = 'blue',
  onComplete 
}: WavePageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const colorSchemes = {
    blue: {
      wave1: 'rgba(59, 130, 246, 0.1)',
      wave2: 'rgba(99, 102, 241, 0.08)', 
      wave3: 'rgba(139, 92, 246, 0.06)',
      gradient: 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.9) 50%, rgba(226, 232, 240, 0.85) 100%)'
    },
    purple: {
      wave1: 'rgba(139, 92, 246, 0.1)',
      wave2: 'rgba(168, 85, 247, 0.08)',
      wave3: 'rgba(192, 132, 252, 0.06)',
      gradient: 'linear-gradient(135deg, rgba(250, 245, 255, 0.95) 0%, rgba(243, 232, 255, 0.9) 50%, rgba(233, 213, 255, 0.85) 100%)'
    },
    emerald: {
      wave1: 'rgba(16, 185, 129, 0.1)',
      wave2: 'rgba(5, 150, 105, 0.08)',
      wave3: 'rgba(4, 120, 87, 0.06)',
      gradient: 'linear-gradient(135deg, rgba(240, 253, 250, 0.95) 0%, rgba(209, 250, 229, 0.9) 50%, rgba(167, 243, 208, 0.85) 100%)'
    },
    orange: {
      wave1: 'rgba(249, 115, 22, 0.1)',
      wave2: 'rgba(234, 88, 12, 0.08)',
      wave3: 'rgba(220, 38, 38, 0.06)',
      gradient: 'linear-gradient(135deg, rgba(255, 251, 235, 0.95) 0%, rgba(254, 243, 199, 0.9) 50%, rgba(253, 230, 138, 0.85) 100%)'
    },
    pink: {
      wave1: 'rgba(236, 72, 153, 0.1)',
      wave2: 'rgba(219, 39, 119, 0.08)',
      wave3: 'rgba(190, 24, 93, 0.06)',
      gradient: 'linear-gradient(135deg, rgba(253, 242, 248, 0.95) 0%, rgba(252, 231, 243, 0.9) 50%, rgba(251, 207, 232, 0.85) 100%)'
    }
  }

  useEffect(() => {
    if (!containerRef.current || !isActive) return

    const waves = containerRef.current.querySelectorAll('.transition-wave')
    const tl = gsap.timeline({
      onComplete: () => onComplete?.()
    })

    if (direction === 'enter') {
      // Faster wave enter animation
      tl.set(containerRef.current, { display: 'block', zIndex: 9999 })
        .fromTo(waves, 
          {
            y: '100vh',
            rotation: -4,
            scale: 0.98,
            opacity: 0
          },
          {
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 0.4, // Reduced from 0.8s
            stagger: 0.04, // Reduced from 0.08s
            ease: "power3.out"
          }
        )
        .to(waves,
          {
            y: '-100vh',
            rotation: 4,
            scale: 1.02,
            opacity: 0,
            duration: 0.3, // Reduced from 0.6s
            stagger: 0.03, // Reduced from 0.06s
            ease: "power3.in",
            delay: 0.05 // Reduced from 0.1s
          }
        )
        .set(containerRef.current, { display: 'none' })
    } else {
      // Faster wave exit animation
      tl.set(containerRef.current, { display: 'block', zIndex: 9999 })
        .fromTo(waves,
          {
            y: '100vh',
            rotation: 4,
            scale: 1.02,
            opacity: 0
          },
          {
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 0.3, // Reduced from 0.5s
            stagger: 0.03, // Reduced from 0.05s
            ease: "power3.out"
          }
        )
        .set(containerRef.current, { display: 'none' })
    }

    return () => {
      tl.kill()
    }
  }, [isActive, direction, onComplete])

  if (!isActive) return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ display: 'none' }}
    >
      {/* Multiple waves for smooth transition effect */}
      <div 
        className="transition-wave absolute bottom-0 left-0 w-full h-full opacity-90"
        style={{
          background: colorSchemes[colorScheme].gradient,
          clipPath: 'polygon(0 40%, 100% 60%, 100% 100%, 0% 100%)',
          transform: 'translateY(100vh)'
        }}
      />
      <div 
        className="transition-wave absolute bottom-0 left-0 w-full h-full opacity-70"
        style={{
          background: colorSchemes[colorScheme].wave2,
          clipPath: 'polygon(0 50%, 100% 70%, 100% 100%, 0% 100%)',
          transform: 'translateY(100vh)'
        }}
      />
      <div 
        className="transition-wave absolute bottom-0 left-0 w-full h-full opacity-50"
        style={{
          background: colorSchemes[colorScheme].wave3,
          clipPath: 'polygon(0 60%, 100% 80%, 100% 100%, 0% 100%)',
          transform: 'translateY(100vh)'
        }}
      />
    </div>
  )
}
