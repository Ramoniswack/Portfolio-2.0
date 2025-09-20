"use client"

import React, { useEffect, useRef } from 'react'
import { lazyInit } from '../../utils/lazyInit'

/**
 * Parallax
 * Lightweight parallax wrapper that updates a CSS variable `--parallax` and
 * applies `transform: translateY(var(--parallax))` to its child. It only runs
 * when the element is in view and disables on reduced-motion or small screens.
 *
 * Props:
 * - speed: number (positive floats: higher = more movement)
 * - className: string
 *
 * Usage:
 * <Parallax speed={0.2}><img ... /></Parallax>
 */

type ParallaxProps = {
  children: React.ReactNode
  speed?: number
  className?: string
}

export default function Parallax({ children, speed = 0.2, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastScroll = useRef(0)

  useEffect(() => {
    if (!ref.current) return

    const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq && mq.matches) return

    if (window.innerWidth < 640) return // disable on small devices

    const el = ref.current

    const startLoop = () => {
      const loop = () => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        // percent visible (0..1)
        const visible = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)))
        const offset = (visible - 0.5) * 2 // -1 .. 1
        const value = (offset * 100 * speed).toFixed(2)
        el.style.setProperty('--parallax', `${value}px`)
        rafRef.current = requestAnimationFrame(loop)
      }
      if (!rafRef.current) rafRef.current = requestAnimationFrame(loop)
    }

    const stopLoop = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    const cancelObs = lazyInit(el, startLoop, { rootMargin: '250px' })

    // clean up
    return () => {
      stopLoop()
      cancelObs()
    }
  }, [speed])

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: 'translateY(var(--parallax))', willChange: 'transform' }}
    >
      {children}
    </div>
  )
}
