"use client"

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface RouterEventsHook {
  onRouteStart?: (url: string) => void
  onRouteComplete?: (url: string) => void
  onRouteError?: (err: Error, url: string) => void
}

export function useRouterEvents({ onRouteStart, onRouteComplete, onRouteError }: RouterEventsHook) {
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
      
      // Monitor for ACTUAL page completion by observing multiple signals
      const checkRouteComplete = () => {
        const isDocumentComplete = document.readyState === 'complete'
        const hasCorrectContent = checkIfPageContentMatches(pathname)
        const isPageStable = checkPageStability(pathname)
        
        console.log(`🔍 Route completion check:`, {
          pathname,
          isDocumentComplete,
          hasCorrectContent,
          isPageStable,
          compilationComplete: compilationCompleteRef.current,
          readyState: document.readyState,
          currentURL: window.location.pathname
        })
        
        // Only complete when ALL criteria are met AND compilation is truly done
        if (isDocumentComplete && hasCorrectContent && isPageStable) {
          if (!compilationCompleteRef.current) {
            compilationCompleteRef.current = true
            console.log(`📋 First stability check passed, verifying compilation completion...`)
            
            // Wait longer to ensure Next.js has finished all its work
            setTimeout(() => {
              // Do a final verification that page is truly ready
              const finalCheck = checkIfPageContentMatches(pathname) && 
                               checkPageStability(pathname) &&
                               document.readyState === 'complete'
              
              if (finalCheck) {
                const routeTime = performance.now() - (routeStartTimeRef.current || 0)
                console.log(`✅ Route TRULY completed: ${pathname} in ${routeTime.toFixed(0)}ms`)
                
                isNavigatingRef.current = false
                onRouteComplete?.(pathname)
                lastPathnameRef.current = pathname
                return
              } else {
                console.log(`⚠️ Final check failed, continuing to monitor...`)
                compilationCompleteRef.current = false
                setTimeout(checkRouteComplete, 400)
              }
            }, 800) // Increased from 500ms to 800ms for more stability
            return
          }
        }
        
        // Not ready yet, check again
        const delay = isDocumentComplete ? 200 : 400
        setTimeout(checkRouteComplete, delay)
      }
      
      // Start checking after a longer delay to allow Next.js compilation to begin
      setTimeout(checkRouteComplete, 1500) // Increased from 1000ms to 1500ms
    }
  }, [pathname, onRouteStart, onRouteComplete])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isNavigatingRef.current = false
      routeStartTimeRef.current = null
      compilationCompleteRef.current = false
    }
  }, [])

  return {
    isNavigating: isNavigatingRef.current,
    routeStartTime: routeStartTimeRef.current
  }
}

// Enhanced content matching that checks for route-specific elements
function checkIfPageContentMatches(path: string): boolean {
  if (path.startsWith('/about')) {
    // About page specific checks - MUST have data-page="about" AND about-specific content
    const hasDataPageAbout = document.querySelector('[data-page="about"]') !== null
    const hasAboutText = (document.querySelector('h1, h2')?.textContent?.toLowerCase().includes('about')) || false
    const hasNoOtherPageData = !document.querySelector('[data-page="blogs"]') && !document.querySelector('[data-page="home"]')
    
    console.log(`🔍 About page content check:`, {
      hasDataPageAbout,
      hasAboutText,
      hasNoOtherPageData,
      url: window.location.pathname
    })
    
    return hasDataPageAbout && hasAboutText && hasNoOtherPageData
  }
  
  if (path.startsWith('/blogs')) {
    // Blog page specific checks - MUST have data-page="blogs" AND blog-specific content
    const hasDataPageBlogs = document.querySelector('[data-page="blogs"]') !== null
    const hasBlogText = (document.querySelector('h1, h2')?.textContent?.toLowerCase().includes('blog')) || false
    const hasNoOtherPageData = !document.querySelector('[data-page="about"]') && !document.querySelector('[data-page="home"]')
    
    console.log(`🔍 Blog page content check:`, {
      hasDataPageBlogs,
      hasBlogText,
      hasNoOtherPageData,
      url: window.location.pathname,
      h1Text: document.querySelector('h1')?.textContent,
      h2Text: document.querySelector('h2')?.textContent
    })
    
    return hasDataPageBlogs && hasBlogText && hasNoOtherPageData
  }
  
  // Home page (/) 
  const hasDataPageHome = document.querySelector('[data-page="home"]') !== null
  const hasNoOtherPageData = !document.querySelector('[data-page="about"]') && !document.querySelector('[data-page="blogs"]')
  
  console.log(`🔍 Home page content check:`, {
    hasDataPageHome,
    hasNoOtherPageData,
    url: window.location.pathname
  })
  
  return hasDataPageHome && hasNoOtherPageData
}

// Check if the page is stable (no pending operations)
function checkPageStability(path: string): boolean {
  // Check if there are any pending font loads
  const hasPendingFonts = document.fonts && document.fonts.status === 'loading'
  
  // Check if images are still loading
  const images = Array.from(document.images)
  const hasLoadingImages = images.some(img => !img.complete)
  
  // Check if there are any active network requests (rough heuristic)
  const hasActiveRequests = performance.getEntriesByType('navigation').length === 0
  
  console.log(`🔍 Page stability check:`, {
    path,
    hasPendingFonts,
    hasLoadingImages: hasLoadingImages && images.length > 0,
    imageCount: images.length,
    fontsStatus: document.fonts?.status || 'unknown'
  })
  
  return !hasPendingFonts && !hasLoadingImages
}
