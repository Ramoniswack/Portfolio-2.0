"use client"

import { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useRouterEvents } from "@/hooks/useRouterEvents"
import { scrollTriggerManager } from "@/lib/scroll-trigger-manager"

interface CompilationContextType {
  isCompiling: boolean
  setCompiling: (compiling: boolean) => void
  isPageLoading: boolean
  currentPageName: string
  setCurrentPageName: (name: string) => void
  startPageLoad: (pageName: string) => void
  completePageLoad: () => void
  cancelLoading: () => void
  isNavigating: boolean
}

const CompilationContext = createContext<CompilationContextType | undefined>(undefined)

export function CompilationProvider({ children }: { children: ReactNode }) {
  const [isCompiling, setIsCompiling] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [currentPageName, setCurrentPageName] = useState("Work")
  const [showContentMismatch, setShowContentMismatch] = useState(false)
  const [pagesPreloaded, setPagesPreloaded] = useState(false)
  const pathname = usePathname()
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const manualLoadingRef = useRef(false)

  // Get page name from pathname
  const getPageName = (path: string) => {
    if (path.startsWith('/about')) return 'About'
    if (path.startsWith('/blogs')) return 'Blog'
    return 'Work'
  }

  // Check if this is a preloaded page (should navigate instantly)
  const isPreloadedPage = (path: string) => {
    const preloadedPages = ['/', '/about', '/blogs']
    return preloadedPages.includes(path) || preloadedPages.some(p => path.startsWith(p))
  }

  // Use router events to detect actual navigation
  useRouterEvents({
    onRouteStart: (url) => {
      // Reset content mismatch state on new navigation
      setShowContentMismatch(false)
      
      // Only auto-start loading if not manually started already
      if (!manualLoadingRef.current) {
        const targetPageName = getPageName(url)

        startPageLoad(targetPageName)
      }
    },
    onRouteComplete: (url) => {

      // Clear content mismatch when route completes properly
      setShowContentMismatch(false)
      
      // For manually managed routes, ONLY complete if the page components haven't called completePageLoad yet
      if (manualLoadingRef.current) {

        // Set a backup timeout in case page component never calls completePageLoad
        setTimeout(() => {
          if (manualLoadingRef.current && isPageLoading) {

            completePageLoad()
          }
        }, 10000) // 10 second backup timeout
        return
      }
      
      // Only auto-complete for non-manually managed routes

      const targetPageName = getPageName(url)
      setIsPageLoading(false)
      setIsCompiling(false)
      setCurrentPageName(targetPageName)
      manualLoadingRef.current = false
    },
    onRouteError: (err, url) => {

      setIsPageLoading(false)
      setIsCompiling(false)
      setShowContentMismatch(false)
      manualLoadingRef.current = false
    },
    onContentMismatch: (expectedPath, actualContent) => {

      setShowContentMismatch(true)
    }
  })

  const startPageLoad = (pageName: string) => {

    manualLoadingRef.current = true
    setCurrentPageName(pageName)
    setIsCompiling(true)
    setIsPageLoading(true)
    // expose a short-lived global flag so lower-level components can know
    // the app is in a navigation/loading state (used to avoid duplicate
    // animations on navigation).
    try {
      ;(window as any).__IS_NAVIGATING = true
    } catch (e) {}
    
    // FREEZE current page animations to prevent re-triggering
    scrollTriggerManager.setNavigating(true)

    // Clear any existing fallback timeout
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current)
    }
    
    // Much longer fallback timeout for Next.js compilation (up to 2 minutes)
    fallbackTimeoutRef.current = setTimeout(() => {

      setIsPageLoading(false)
      setIsCompiling(false)
      manualLoadingRef.current = false
      scrollTriggerManager.setNavigating(false)
      // Update to current pathname
      setCurrentPageName(getPageName(pathname))
    }, 120000) // 2 minute fallback for very slow loads
  }

  const completePageLoad = () => {

    // Clear any fallback timeout
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current)
      fallbackTimeoutRef.current = null
    }
    
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setIsPageLoading(false)
      setIsCompiling(false)
      setShowContentMismatch(false)
      manualLoadingRef.current = false
      
      // clear the global navigating flag
      try { (window as any).__IS_NAVIGATING = false } catch (e) {}

      // UN-FREEZE animations for the new page
      scrollTriggerManager.setNavigating(false)

      // Update page name to match current pathname
      setCurrentPageName(getPageName(pathname))
    }, 150)
  }

    const cancelLoading = () => {

    // Clear any fallback timeout
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current)
      fallbackTimeoutRef.current = null
    }
    
    // ONLY dismiss the loading indicator, DO NOT revert navigation
    setIsPageLoading(false)
    setIsCompiling(false)
    setShowContentMismatch(false)
    manualLoadingRef.current = false
    
  try { (window as any).__IS_NAVIGATING = false } catch (e) {}

    // UN-FREEZE animations but keep the current navigation
    scrollTriggerManager.setNavigating(false)
    
    // Update page name to match current pathname (where user navigated to)
    setCurrentPageName(getPageName(pathname))
    
    // DO NOT reload or revert - user stays on the page they navigated to
  }

  const setCompiling = (compiling: boolean) => {
    setIsCompiling(compiling)
    if (!compiling) {
      completePageLoad()
    }
  }

  return (
    <CompilationContext.Provider value={{ 
      isCompiling, 
      setCompiling, 
      isPageLoading, 
      currentPageName,
      setCurrentPageName,
      startPageLoad,
      completePageLoad,
      cancelLoading,
      isNavigating: isPageLoading || isCompiling
    }}>
      {children}
    </CompilationContext.Provider>
  )
}

export function useCompilation() {
  const context = useContext(CompilationContext)
  if (context === undefined) {
    throw new Error('useCompilation must be used within a CompilationProvider')
  }
  return context
}
