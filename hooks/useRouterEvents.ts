"use client"

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface RouterEventsHook {
  onRouteStart?: (url: string) => void
  onRouteComplete?: (url: string) => void
  onRouteError?: (err: Error, url: string) => void
  onContentMismatch?: (expectedPath: string, actualContent: string) => void
}

// Simplified content matching - ONLY check for Next.js compilation completion
function checkIfPageContentMatches(path: string): boolean {
  const currentDataPage = document.querySelector('[data-page]')?.getAttribute('data-page')
  const currentUrl = window.location.pathname
  const isDocumentComplete = document.readyState === 'complete'
  
  // Basic check - must have correct data-page, URL, and document complete
  let expectedPage = 'work'
  if (path.startsWith('/about')) expectedPage = 'about'
  if (path.startsWith('/blogs')) expectedPage = 'blogs'
  
  const hasCorrectContent = currentDataPage === expectedPage && 
                           currentUrl.includes(path) && 
                           isDocumentComplete
  
  console.log(`� Next.js compilation check for ${path}:`, {
    currentDataPage,
    expectedPage,
    currentUrl,
    expectedPath: path,
    isDocumentComplete,
    hasCorrectContent
  })
  
  return hasCorrectContent
}

// Check if Next.js has finished compiling by looking for stable page structure
function checkNextJSCompilationComplete(path: string): boolean {
  try {
    // Wait for Next.js to fully hydrate and compile
    const hasReactHydrated = document.querySelector('[data-reactroot]') !== null || 
                            document.querySelector('#__next') !== null ||
                            document.body.children.length > 0
    
    const hasCorrectPageStructure = document.querySelector(`[data-page]`) !== null
    const isFullyLoaded = document.readyState === 'complete'
    const noLoadingSpinners = document.querySelectorAll('[class*="loading"], [class*="spinner"]').length === 0
    
    const isCompiled = hasReactHydrated && hasCorrectPageStructure && isFullyLoaded && noLoadingSpinners
    
    console.log(`🏗️ Next.js compilation status for ${path}:`, {
      hasReactHydrated,
      hasCorrectPageStructure,
      isFullyLoaded,
      noLoadingSpinners,
      isCompiled
    })
    
    return isCompiled
  } catch (error) {
    console.error('Error checking Next.js compilation:', error)
    return false
  }
}

export function useRouterEvents({ onRouteStart, onRouteComplete, onRouteError, onContentMismatch }: RouterEventsHook) {
  const pathname = usePathname()
  const lastPathnameRef = useRef(pathname)
  const isNavigatingRef = useRef(false)
  const routeStartTimeRef = useRef<number | null>(null)
  const compilationCompleteRef = useRef(false)
  const maxAttemptsRef = useRef(0)

  useEffect(() => {
    // Detect route change start
    if (lastPathnameRef.current !== pathname && !isNavigatingRef.current) {
      isNavigatingRef.current = true
      compilationCompleteRef.current = false
      routeStartTimeRef.current = performance.now()
      maxAttemptsRef.current = 0
      
      console.log(`🚀 Route navigation started: ${pathname}`)
      onRouteStart?.(pathname)
      
      // Monitor for ACTUAL page completion with attempt limiting
      const checkRouteComplete = () => {
        maxAttemptsRef.current++
        
        // Keep trying until we get the right content - NO FORCED COMPLETION
        // Only stop if we've been trying for more than 60 seconds (120 attempts)
        if (maxAttemptsRef.current > 120) {
          console.log(`⚠️ Giving up after 60 seconds of attempts for ${pathname}`)
          compilationCompleteRef.current = true
          isNavigatingRef.current = false
          onRouteComplete?.(pathname)
          lastPathnameRef.current = pathname
          return
        }
        
        const hasCorrectContent = checkIfPageContentMatches(pathname)
        const isNextJSCompiled = checkNextJSCompilationComplete(pathname)
        
        console.log(`🔍 Next.js compilation check ${maxAttemptsRef.current}/120 (${pathname}):`, {
          hasCorrectContent,
          isNextJSCompiled,
          readyState: document.readyState,
          compilationComplete: compilationCompleteRef.current
        })
        
        // ONLY complete when Next.js has actually finished compiling
        if (hasCorrectContent && isNextJSCompiled && !compilationCompleteRef.current) {
          compilationCompleteRef.current = true
          isNavigatingRef.current = false
          
          const totalTime = routeStartTimeRef.current ? performance.now() - routeStartTimeRef.current : 0
          console.log(`✅ Next.js compilation complete: ${pathname} (${totalTime.toFixed(2)}ms)`)
          
          onRouteComplete?.(pathname)
          lastPathnameRef.current = pathname
          return
        }
        
        // Report content mismatch but KEEP TRYING
        if (hasCorrectContent && !isNextJSCompiled && routeStartTimeRef.current && maxAttemptsRef.current > 10) {
          const elapsedTime = performance.now() - routeStartTimeRef.current
          if (maxAttemptsRef.current % 10 === 0) { // Only log every 10th attempt to reduce spam
            console.warn(`⚠️ Content present but Next.js still compiling after ${elapsedTime.toFixed(2)}ms (attempt ${maxAttemptsRef.current}) - CONTINUING...`)
            const actualContent = document.querySelector('[data-page]')?.getAttribute('data-page') || 'unknown'
            onContentMismatch?.(pathname, actualContent)
          }
        }
        
        // ALWAYS continue checking until correct content loads
        setTimeout(checkRouteComplete, 500) // 500ms intervals
      }
      
      // Start monitoring with initial delay
      setTimeout(checkRouteComplete, 1000)
    }
  }, [pathname, onRouteStart, onRouteComplete, onRouteError, onContentMismatch])

  return {
    isNavigating: isNavigatingRef.current,
    routeStartTime: routeStartTimeRef.current
  }
}
