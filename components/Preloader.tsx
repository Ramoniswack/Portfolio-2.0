"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { useReducedMotion } from "@/hooks/useReducedMotion"

const greetings = [
  "Hello", // English
  "Namaste", // Hindi/Nepali
  "こんにちは", // Japanese
  "Hola", // Spanish
  "مرحبا", // Arabic
  "Bonjour", // French
  "Hallo", // German
  "Ciao", // Italian
  "Olá", // Portuguese
  "Привет", // Russian
  "你好", // Chinese
  "안녕하세요", // Korean
  "Salaam", // Urdu
  "Halo", // Indonesian
  "Merhaba", // Turkish
]

// Global variable to track if preloader has been shown in this session
let preloaderShown = false

interface PreloaderProps {
  onComplete: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [currentGreeting, setCurrentGreeting] = useState(greetings[0])

  useEffect(() => {
    // Check if preloader should be skipped (already shown in this session)
    if (preloaderShown) {
      onComplete()
      return
    }

    // Mark as shown for this session
    preloaderShown = true

    if (!containerRef.current || !textRef.current) return

    const container = containerRef.current
    const textElement = textRef.current

    if (prefersReducedMotion) {
      // Skip animation for reduced motion
      setTimeout(onComplete, 500)
      return
    }

    console.log("Starting preloader animation with", greetings.length, "greetings")
    
    let currentIndex = 0
    const duration = 150 // 150ms per greeting - faster loading
    
    // Function to show next greeting with direct DOM manipulation
    const showNextGreeting = () => {
      if (currentIndex >= greetings.length) {
        console.log("All greetings shown, completing...")
        // All greetings shown, exit after short delay
        setTimeout(() => {
          gsap.to(container, {
            opacity: 0,
            scale: 0.95,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: onComplete
          })
        }, 300)
        return
      }
      
      const greeting = greetings[currentIndex]
      console.log(`Showing greeting ${currentIndex + 1}/${greetings.length}: ${greeting}`)
      
      // FORCE DOM update - bypassing React completely
      if (textElement) {
        textElement.textContent = greeting
        // Also update React state as backup
        setCurrentGreeting(greeting)
        // Force a repaint
        textElement.style.transform = `translateZ(0) scale(${1 + Math.random() * 0.001})`
      }
      
      currentIndex++
      setTimeout(showNextGreeting, duration)
    }
    
    // Start immediately
    showNextGreeting()

    return () => {
      gsap.killTweensOf(container)
    }
  }, [onComplete, prefersReducedMotion])

  return (
    <div ref={containerRef} className="preloader">
      {/* Animated Background Waves */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center">
        <div
          ref={textRef}
          className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-slate-100 via-slate-300 to-slate-100 bg-clip-text text-transparent mb-6 tracking-tight drop-shadow-2xl font-inter transition-all duration-200 ease-in-out"
          key={currentGreeting}
        >
          {currentGreeting}
        </div>
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-slate-500 to-slate-700 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-slate-600 to-slate-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}
