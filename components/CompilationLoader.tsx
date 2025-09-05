"use client"

import React, { useEffect, useState } from "react"

interface CompilationLoaderProps {
  isVisible: boolean
  message?: string
}

export function CompilationLoader({ isVisible, message = "Loading..." }: CompilationLoaderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isVisible) return null

  return (
    <div 
      className="fixed top-4 right-4 z-[10000] bg-background/80 backdrop-blur-sm border border-border rounded-full p-3 shadow-lg"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Spinning circle */}
        <div 
          className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin"
          style={{
            animation: 'spin 1s linear infinite',
          }}
        />
        <span className="text-sm font-medium text-foreground whitespace-nowrap">
          {message}
        </span>
      </div>
    </div>
  )
}

// Global CSS for the loading animation
const styles = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.type = 'text/css'
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}
