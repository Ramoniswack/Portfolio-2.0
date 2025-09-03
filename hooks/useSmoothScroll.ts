"use client"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export function useSmoothScroll() {
  useEffect(() => {
    let lenis: any
    let rafId = 0
    let cancelled = false

    const setup = async () => {
      try {
        gsap.registerPlugin(ScrollTrigger)
        const { default: Lenis } = await import("lenis")
        lenis = new Lenis({
          duration: 1.1,
          smoothWheel: true,
          smoothTouch: false,
        })
        const raf = (time: number) => {
          lenis.raf(time)
          ScrollTrigger.update()
          rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)
      } catch {
        // no-op
      }
    }

    setup()

    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
      if (lenis && !cancelled) lenis.destroy()
    }
  }, [])
}

