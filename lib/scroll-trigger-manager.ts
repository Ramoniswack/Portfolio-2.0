"use client"

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

class ScrollTriggerManager {
  private triggers: ScrollTrigger[] = []
  private isNavigating = false

  setNavigating(navigating: boolean) {
    this.isNavigating = navigating
    
    if (navigating) {
      // Disable all scroll triggers during navigation
      this.triggers.forEach(trigger => {
        trigger.disable()
      })
    } else {
      // Re-enable scroll triggers after navigation
      setTimeout(() => {
        this.triggers.forEach(trigger => {
          if (trigger.isActive !== false) {
            trigger.enable()
          }
        })
      }, 100)
    }
  }

  create(config: any) {
    if (this.isNavigating) {
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
  if (navigationState) {
    return null // Don't create animations during navigation
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
