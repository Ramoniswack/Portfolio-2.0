"use client"

import { useEffect } from "react"

export function SmoothScrollProvider() {
  useEffect(() => {
    let cleanup: (() => void) | undefined
    ;(async () => {
      try {
        const { default: Lenis } = await import("lenis")
        const lenis = new Lenis({ smoothWheel: true, duration: 1.1 })
        const raf = (t: number) => {
          lenis.raf(t)
          ;(window as any).ScrollTrigger?.update?.()
          requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)
        cleanup = () => lenis.destroy()
      } catch {}
    })()
    return () => cleanup?.()
  }, [])
  return null
}

