"use client"

import React, { useEffect, useState } from "react"

interface CompilationLoaderProps {
  isVisible: boolean
  message?: string
  showContentMismatch?: boolean
  targetPage?: string
}

export function CompilationLoader({ 
  isVisible, 
  message = "Loading...", 
  showContentMismatch = false,
  targetPage = ""
}: CompilationLoaderProps) {
  const [mounted, setMounted] = useState(false)
  const [showMismatchWarning, setShowMismatchWarning] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (showContentMismatch) {
      setShowMismatchWarning(true)
      // Hide warning after a delay but keep loading
      const timer = setTimeout(() => setShowMismatchWarning(false), 3000)
      return () => clearTimeout(timer)
    } else {
      setShowMismatchWarning(false)
    }
  }, [showContentMismatch])

  if (!mounted || !isVisible) return null

  const getDisplayMessage = () => {
    if (showMismatchWarning) {
      return `Compiling ${targetPage}... (Wrong content detected, waiting for compilation)`
    }
    return message
  }

  const getLoaderColor = () => {
    if (showMismatchWarning) {
      return "border-orange-500/30 border-t-orange-500"
    }
    return "border-accent/30 border-t-accent"
  }

  const getBackgroundColor = () => {
    if (showMismatchWarning) {
      return "bg-orange-50/90 dark:bg-orange-950/90 border-orange-200 dark:border-orange-800"
    }
    return "bg-background/80 border-border"
  }

  if (!mounted || !isVisible) return null

  return (
    <div 
      className={`fixed top-4 right-4 z-[10000] ${getBackgroundColor()} backdrop-blur-sm rounded-full p-3 shadow-lg max-w-xs`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Enhanced spinner with dynamic color */}
        <div 
          className={`w-5 h-5 border-2 ${getLoaderColor()} rounded-full animate-spin flex-shrink-0`}
          style={{
            animation: 'spin 1s linear infinite',
          }}
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {getDisplayMessage()}
          </span>
          {showMismatchWarning && (
            <span className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Next.js is compiling the correct page...
            </span>
          )}
        </div>
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
