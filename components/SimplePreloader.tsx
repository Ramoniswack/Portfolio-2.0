"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"

const greetings = [
  "Hello", "Namaste", "こんにちは", "Hola", "مرحبا", 
  "Bonjour", "Hallo", "Ciao", "Olá", "Привет", 
  "你好", "안녕하세요", "Salaam", "Halo", "Merhaba"
]

interface SimplePreloaderProps {
  onComplete: () => void
}

export function SimplePreloader({ onComplete }: SimplePreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasCompletedRef = useRef(false)

  const completePreloader = useCallback(() => {
    if (hasCompletedRef.current) return
    hasCompletedRef.current = true
    
    console.log("Starting wave transition...")
    if (containerRef.current) {
      // First, animate the waves upward
      gsap.to(".wave", {
        y: -window.innerHeight,
        duration: 1.2,
        ease: "power2.inOut",
        stagger: 0.1
      })
      
      // Then fade out the entire preloader
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: "power2.out",
        onComplete: () => {
          console.log("Preloader complete!")
          onComplete()
        }
      })
    } else {
      onComplete()
    }
  }, [onComplete])

  useEffect(() => {
    console.log("SimplePreloader started!")
    console.log("Starting greeting animation with", greetings.length, "greetings")

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1
        if (next >= greetings.length) {
          console.log("All greetings completed, finishing...")
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setTimeout(() => {
            completePreloader()
          }, 150)
          return prev
        }
        console.log(`Showing greeting ${next + 1}/${greetings.length}: ${greetings[next]}`)
        return next
      })
    }, 200) // Much faster - 200ms instead of 400ms

    return () => {
      console.log("Cleaning up preloader...")
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [completePreloader])

  return (
    <div ref={containerRef} className="preloader">
      <div className="absolute inset-0 overflow-hidden">
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
      </div>
      
      <div className="relative z-10 text-center">
        <div className="text-6xl md:text-8xl font-bold text-blue-600 mb-6 tracking-tight drop-shadow-lg font-inter transition-all duration-150">
          {greetings[currentIndex]}
        </div>
        
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}
