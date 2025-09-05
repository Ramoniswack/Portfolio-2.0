"use client"

import React from 'react'

interface ContentMismatchOverlayProps {
  isVisible: boolean
  targetPage: string
  message?: string
}

export function ContentMismatchOverlay({ 
  isVisible, 
  targetPage, 
  message = "Compiling page..." 
}: ContentMismatchOverlayProps) {
  if (!isVisible) return null

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-md flex items-center justify-center"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        {/* Enhanced spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto" />
          <div className="w-12 h-12 border-3 border-accent2/30 border-t-accent2 rounded-full animate-spin absolute top-2 left-1/2 transform -translate-x-1/2" 
               style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        
        {/* Message */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-foreground">
            {message}
          </h3>
          <p className="text-muted-foreground">
            Compiling <span className="text-accent font-medium">{targetPage}</span> page...
          </p>
          <div className="text-sm text-muted-foreground/70">
            Next.js is building the page content. This may take a moment.
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="w-full bg-border rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent to-accent2 rounded-full animate-pulse"
            style={{
              animation: 'loading-progress 2s ease-in-out infinite'
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading-progress {
          0%, 100% { width: 30%; }
          50% { width: 70%; }
        }
      `}</style>
    </div>
  )
}
