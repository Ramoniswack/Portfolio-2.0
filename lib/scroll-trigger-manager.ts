"use client"

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

class ScrollTriggerManager {
  private triggers: ScrollTrigger[] = []
  private isNavigating = false
  // Global toggle to disable scroll/GSAP animations site-wide for performance
  private disableAnimations = false

  setNavigating(navigating: boolean) {
    this.isNavigating = navigating
    
    if (navigating) {
      console.log('🚫 Disabling scroll triggers during navigation')
      
      // Simply disable scroll triggers - don't mess with timeline
      this.triggers.forEach(trigger => {
        trigger.disable()
      })
      
    } else {
      console.log('✅ Re-enabling scroll triggers after navigation')
      
      // Re-enable scroll triggers after navigation
      setTimeout(() => {
        this.triggers.forEach(trigger => {
          if (trigger.isActive !== false) {
            trigger.enable()
          }
        })
      }, 200) // Slightly longer delay
    }
  }

  create(config: any) {
    if (this.isNavigating || this.disableAnimations) {
      return null
    }

    const trigger = ScrollTrigger.create(config)
    this.triggers.push(trigger)
    return trigger
  }

  killAll() {
    this.triggers.forEach(trigger => trigger.kill())
    this.triggers = []
  }

  remove(trigger: ScrollTrigger) {
    const index = this.triggers.indexOf(trigger)
    if (index > -1) {
      this.triggers.splice(index, 1)
      trigger.kill()
    }
  }
}

export const scrollTriggerManager = new ScrollTriggerManager()

// Utility function to create scroll-based animations safely
export const createScrollAnimation = (element: any, config: any, navigationState: boolean) => {
  // If animations are disabled globally or during navigation, do nothing.
  try {
    const disabled = (typeof window !== 'undefined' && (window as any).__DISABLE_ANIMATIONS) || false
    if (navigationState || disabled) return null
  } catch (e) {
    // ignore
  }

  const scrollTriggerConfig = {
    ...config.scrollTrigger,
    // Override toggleActions to prevent reverse animations
    toggleActions: "play none none none",
    once: true, // Only play once
  }

  const animation = gsap.fromTo(element, config.from, {
    ...config.to,
    scrollTrigger: scrollTriggerConfig
  })

  return animation
}
