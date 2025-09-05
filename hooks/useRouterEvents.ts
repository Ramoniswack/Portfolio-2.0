"use client"

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface RouterEventsHook {
  onRouteStart?: (url: string) => void
  onRouteComplete?: (url: string) => void
  onRouteError?: (err: Error, url: string) => void
  onContentMismatch?: (expectedPath: string, actualContent: string) => void
}

// Simplified content matching to prevent flickering
function checkIfPageContentMatches(path: string): boolean {
  const currentDataPage = document.querySelector('[data-page]')?.getAttribute('data-page')
  const currentUrl = window.location.pathname
  
  console.log(`🔍 Simple content validation for ${path}:`, {
    currentDataPage,
    currentUrl,
    expectedPath: path
  })
  
  // Simple validation - just check data-page attribute and URL
  if (path.startsWith('/about')) {
    const isValid = currentDataPage === 'about' && currentUrl.includes('/about')
    console.log(`📋 About page validation: ${isValid}`)
    return isValid
  }
  
  if (path.startsWith('/blogs')) {
    const isValid = currentDataPage === 'blogs' && currentUrl.includes('/blogs')
    console.log(`📚 Blog page validation: ${isValid}`)
    return isValid
  }
  
  // Home page
  const isValid = currentDataPage === 'home' && (currentUrl === '/' || currentUrl === '')
  console.log(`🏠 Home page validation: ${isValid}`)
  return isValid
}

// Check if the page is stable (no pending operations)
function checkPageStability(path: string): boolean {
  // Check if there are any pending font loads
  const hasPendingFonts = document.fonts && document.fonts.status === 'loading'
  
  // Check if images are still loading
  const images = Array.from(document.images)
  const hasLoadingImages = images.some(img => !img.complete)
  
  console.log(`🔍 Page stability check:`, {
    path,
    hasPendingFonts,
    hasLoadingImages,
    isStable: !hasPendingFonts && !hasLoadingImages
  })
  
  return !hasPendingFonts && !hasLoadingImages
}

export function useRouterEvents({ onRouteStart, onRouteComplete, onRouteError, onContentMismatch }: RouterEventsHook) {
  const pathname = usePathname()
  const lastPathnameRef = useRef(pathname)
  const isNavigatingRef = useRef(false)
  const routeStartTimeRef = useRef<number | null>(null)
  const compilationCompleteRef = useRef(false)

  useEffect(() => {
    // Detect route change start
    if (lastPathnameRef.current !== pathname && !isNavigatingRef.current) {
      isNavigatingRef.current = true
      compilationCompleteRef.current = false
      routeStartTimeRef.current = performance.now()
      
      console.log(`🚀 Route navigation started: ${pathname}`)
      onRouteStart?.(pathname)
      
      // Monitor for ACTUAL page completion by observing multiple signals with simplified validation
      const checkRouteComplete = () => {
        const isDocumentComplete = document.readyState === 'complete'
        const hasCorrectContent = checkIfPageContentMatches(pathname)
        const isPageStable = checkPageStability(pathname)
        
        console.log(`🔍 Route completion check (${pathname}):`, {
          isDocumentComplete,
          hasCorrectContent,
          isPageStable,
          readyState: document.readyState,
          compilationComplete: compilationCompleteRef.current
        })
        
        if (isDocumentComplete && hasCorrectContent && isPageStable && !compilationCompleteRef.current) {
          compilationCompleteRef.current = true
          isNavigatingRef.current = false
          
          const totalTime = routeStartTimeRef.current ? performance.now() - routeStartTimeRef.current : 0
          console.log(`✅ Route navigation complete: ${pathname} (${totalTime.toFixed(2)}ms)`)
          
          onRouteComplete?.(pathname)
          lastPathnameRef.current = pathname
          return
        }
        
        // If content doesn't match after reasonable time, report mismatch
        if (isDocumentComplete && !hasCorrectContent && routeStartTimeRef.current) {
          const elapsedTime = performance.now() - routeStartTimeRef.current
          if (elapsedTime > 1000) { // Reduced from 2000ms to 1000ms
            console.warn(`⚠️  Content mismatch detected after ${elapsedTime.toFixed(2)}ms`)
            const actualContent = document.querySelector('[data-page]')?.getAttribute('data-page') || 'unknown'
            onContentMismatch?.(pathname, actualContent)
          }
        }
        
        // Continue checking - reduced frequency to prevent flickering
        setTimeout(checkRouteComplete, 500) // Increased from 100ms to 500ms
      }
      
      // Start monitoring immediately but with initial delay
      setTimeout(checkRouteComplete, 1000) // Reduced from 2000ms to 1000ms
    }
  }, [pathname, onRouteStart, onRouteComplete, onRouteError, onContentMismatch])

  return {
    isNavigating: isNavigatingRef.current,
    routeStartTime: routeStartTimeRef.current
  }
}
