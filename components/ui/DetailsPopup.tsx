"use client"

import React, { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type DetailsPopupProps = {
  open: boolean
  onClose: () => void
  title?: string
  children?: React.ReactNode
}

export default function DetailsPopup({ open, onClose, title, children }: DetailsPopupProps) {
  const isClosingRef = useRef(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!open || !mounted) return null

  const handleClose = () => {
    if (isClosingRef.current) return
    
    isClosingRef.current = true
    onClose()
    
    setTimeout(() => {
      isClosingRef.current = false
    }, 300)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200" 
      role="dialog" 
      aria-modal="true"
      onClick={handleBackdropClick}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300" />
      
      {/* Dialog Container - Full screen on mobile, centered modal on desktop */}
      <div className="relative bg-card w-full h-full sm:w-[90vw] sm:h-auto sm:max-w-3xl sm:max-h-[85vh] sm:rounded-2xl shadow-2xl z-[100000] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
        
        {/* Header with Close Button */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-border/50 bg-card/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground pr-16 line-clamp-2">{title}</h3>
          
          <button
            onClick={handleClose}
            aria-label="Close details"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-destructive hover:bg-destructive/90 active:bg-destructive text-destructive-foreground rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-all shadow-lg z-20 hover:scale-105 active:scale-95 touch-manipulation"
          >
            <span className="text-2xl font-bold leading-none">✕</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 bg-card">
          <div className="text-muted-foreground text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words">
            {children}
          </div>
        </div>

        {/* Footer with Close Button */}
        <div className="flex-shrink-0 px-6 py-5 border-t border-border/50 bg-card/95 backdrop-blur-sm flex justify-center sm:justify-end">
          <button 
            onClick={handleClose} 
            className="w-full sm:w-auto px-10 py-4 bg-accent hover:bg-accent/90 active:bg-accent/80 text-accent-foreground rounded-xl font-semibold transition-all shadow-md hover:shadow-lg text-base sm:text-lg touch-manipulation active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )

  // Use React Portal to render modal at document root level
  // This ensures it's completely outside the video card DOM hierarchy
  return createPortal(modalContent, document.body)
}
