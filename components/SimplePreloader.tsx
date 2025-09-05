"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { PagePreloader } from "./PagePreloader"

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
  const [allPagesReady, setAllPagesReady] = useState(false)
  const [greetingsComplete, setGreetingsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasCompletedRef = useRef(false)

  const completePreloader = useCallback(() => {
    if (hasCompletedRef.current) return
    hasCompletedRef.current = true
    
    console.log("🎬 Starting wave transition - all pages preloaded!")
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
          console.log("✅ Preloader complete! Navigation should now be instant.")
          onComplete()
        }
      })
    } else {
      onComplete()
    }
  }, [onComplete])

  // Complete preloader only when BOTH greetings and page preloading are done
  useEffect(() => {
    if (greetingsComplete && allPagesReady) {
      console.log("🚀 Both greetings and page preloading complete!")
      setTimeout(() => {
        completePreloader()
      }, 300)
    }
  }, [greetingsComplete, allPagesReady, completePreloader])

  useEffect(() => {
    console.log("🎭 SimplePreloader started with page preloading!")
    console.log("Starting greeting animation with", greetings.length, "greetings")

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1
        if (next >= greetings.length) {
          console.log("📝 All greetings completed!")
          setGreetingsComplete(true)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return prev
        }
        console.log(`Showing greeting ${next + 1}/${greetings.length}: ${greetings[next]}`)
        return next
      })
    }, 250) // Slightly slower to allow more time for preloading

    return () => {
      console.log("Cleaning up preloader...")
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="preloader">
      {/* Page preloader - runs in background during greetings */}
      <PagePreloader 
        isActive={true}
        onAllPagesReady={() => {
          console.log("📚 All pages preloaded!")
          setAllPagesReady(true)
        }}
      />
      
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
        
        {/* Progress indicator */}
        <div className="text-sm text-blue-500/70 mt-4">
          {allPagesReady ? (
            greetingsComplete ? "Ready!" : "Pages loaded, finishing greetings..."
          ) : (
            "Loading pages..."
          )}
        </div>
      </div>
    </div>
  )
}
