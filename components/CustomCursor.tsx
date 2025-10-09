"use client"

import { useEffect, useRef } from "react"

/**
 * CSS-Only Custom Cursor - Zero Performance Impact
 * 
 * This implementation uses pure CSS for the custom cursor instead of 
 * JavaScript RAF loops, resulting in near-zero CPU usage and no lag.
 * 
 * Features:
 * - Custom PNG cursor designs (better browser support)
 * - Hover state changes (pointer hand on interactive elements)
 * - Hardware accelerated (GPU)
 * - Works on all devices without performance issues
 * - Respects prefers-reduced-motion
 * - Graceful degradation for touch devices
 * - Persistent across page navigations
 */
export default function CustomCursor(): null {
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Prevent double initialization
    if (hasInitialized.current) return
    
    // Skip on touch devices or if user prefers reduced motion
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (isTouch || prefersReduced) return

    // Add class to body to enable CSS cursor
    document.body.classList.add('custom-cursor-enabled')
    hasInitialized.current = true

    // Cleanup - only remove if component is truly unmounting (app closing)
    return () => {
      // Don't remove on navigation, only on actual unmount
      if (typeof window !== 'undefined' && !window.location) {
        document.body.classList.remove('custom-cursor-enabled')
      }
    }
  }, [])

  return null
}

// Named export for backwards compatibility
export { CustomCursor }
