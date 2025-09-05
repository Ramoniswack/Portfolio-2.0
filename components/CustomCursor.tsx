"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const normalCursorRef = useRef<HTMLDivElement>(null)
  const hoverCursorRef = useRef<HTMLDivElement>(null)
  const scrollCursorRef = useRef<HTMLDivElement>(null)
  const [cursorState, setCursorState] = useState<'normal' | 'hover' | 'scroll'>('normal')
  const [isScrolling, setIsScrolling] = useState(false)
  
  // Performance optimization: use refs for tracking position
  const positionRef = useRef({ x: 0, y: 0 })
  const animationIdRef = useRef<number | null>(null)

  // Ultra-smooth cursor movement with requestAnimationFrame
  const updateCursorPosition = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${positionRef.current.x - 24}px, ${positionRef.current.y - 24}px, 0)`
    }
  }, [])

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    // Optimized mouse movement with RAF for 60fps smoothness
    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current.x = e.clientX
      positionRef.current.y = e.clientY
      
      // Cancel previous frame
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      
      // Schedule update on next frame
      animationIdRef.current = requestAnimationFrame(updateCursorPosition)
    }

    // Handle scroll detection with reduced timeout for snappier response
    const handleScroll = () => {
      setIsScrolling(true)
      setCursorState('scroll')
      
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
        setCursorState('normal')
      }, 100) // Reduced from 150ms to 100ms
    }

    // Optimized hover detection with delegation
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!isScrolling && (
        target.closest('[data-pointer="interactive"]') ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.project-card') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[tabindex]')
      )) {
        setCursorState('hover')
      }
    }

    // Handle mouse out
    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!isScrolling && (
        target.closest('[data-pointer="interactive"]') ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.project-card') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[tabindex]')
      )) {
        setCursorState('normal')
      }
    }

    // Show cursor when mouse enters window
    const handleMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1'
    }

    // Hide cursor when mouse leaves window
    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
    }

    // Add event listeners with passive option for better performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseout', handleMouseOut, { passive: true })

    // Hide default cursor
    document.body.style.cursor = 'none'
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      clearTimeout(scrollTimeout)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      document.body.style.cursor = 'auto'
    }
  }, [isScrolling, updateCursorPosition])

  return (
    <div 
      ref={cursorRef}
      className="custom-cursor-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '48px',
        height: '48px',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        transition: 'opacity 0.2s ease',
        willChange: 'transform', // Optimize for animations
      }}
    >
      {/* Normal cursor - cursor.svg */}
      <div 
        ref={normalCursorRef}
        className="cursor-svg normal-cursor"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '48px',
          height: '48px',
          backgroundImage: 'url(/cursors/cursor.svg)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: cursorState === 'normal' ? 1 : 0,
          transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: cursorState === 'normal' ? 'scale(1)' : 'scale(0.8)',
          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
          willChange: 'transform, opacity',
        }}
      />
      
      {/* Hover cursor - pointinghand.svg */}
      <div 
        ref={hoverCursorRef}
        className="cursor-svg hover-cursor"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '48px',
          height: '48px',
          backgroundImage: 'url(/cursors/pointinghand.svg)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: cursorState === 'hover' ? 1 : 0,
          transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: cursorState === 'hover' ? 'scale(1.1)' : 'scale(0.8)',
          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
          willChange: 'transform, opacity',
        }}
      />
      
      {/* Scroll cursor - closedhand.svg */}
      <div 
        ref={scrollCursorRef}
        className="cursor-svg scroll-cursor"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '48px',
          height: '48px',
          backgroundImage: 'url(/cursors/closedhand.svg)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: cursorState === 'scroll' ? 1 : 0,
          transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: cursorState === 'scroll' ? 'scale(1)' : 'scale(0.8)',
          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
          willChange: 'transform, opacity',
        }}
      />
    </div>
  )
}
