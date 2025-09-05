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
  isNavigating: boolean
}

const CompilationContext = createContext<CompilationContextType | undefined>(undefined)

export function CompilationProvider({ children }: { children: ReactNode }) {
  const [isCompiling, setIsCompiling] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [currentPageName, setCurrentPageName] = useState("Work")
  const pathname = usePathname()
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const manualLoadingRef = useRef(false)

  // Get page name from pathname
  const getPageName = (path: string) => {
    if (path.startsWith('/about')) return 'About'
    if (path.startsWith('/blogs')) return 'Blog'
    return 'Work'
  }

  // Use router events to detect actual navigation
  useRouterEvents({
    onRouteStart: (url) => {
      // Only auto-start loading if not manually started already
      if (!manualLoadingRef.current) {
        const targetPageName = getPageName(url)
        console.log(`🔥 Auto-starting loading for: ${targetPageName}`)
        startPageLoad(targetPageName)
      }
    },
    onRouteComplete: (url) => {
      console.log(`🎯 Router detected completion: ${url}, manual: ${manualLoadingRef.current}`)
      
      // For manually managed routes, NEVER auto-complete via router events
      // ONLY let the page components complete via completePageLoad()
      if (manualLoadingRef.current) {
        console.log(`✋ Ignoring router completion for manual route: ${url}`)
        return // Do nothing, let page component handle it
      }
      
      // Only auto-complete for non-manually managed routes
      console.log(`🔄 Auto-completing non-manual route: ${url}`)
      const targetPageName = getPageName(url)
      setIsPageLoading(false)
      setIsCompiling(false)
      setCurrentPageName(targetPageName)
      manualLoadingRef.current = false
    },
    onRouteError: (err, url) => {
      console.error('Route error:', err)
      setIsPageLoading(false)
      setIsCompiling(false)
      manualLoadingRef.current = false
    }
  })

  const startPageLoad = (pageName: string) => {
    console.log(`🚀 Starting page load: ${pageName}`)
    manualLoadingRef.current = true
    setCurrentPageName(pageName)
    setIsCompiling(true)
    setIsPageLoading(true)
    
    // Disable scroll triggers during navigation
    scrollTriggerManager.setNavigating(true)
    
    // Clear any existing fallback timeout
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current)
    }
    
    // Much longer fallback timeout for Next.js compilation (up to 30 seconds)
    fallbackTimeoutRef.current = setTimeout(() => {
      console.log(`⏰ Fallback timeout reached for ${pageName}`)
      setIsPageLoading(false)
      setIsCompiling(false)
      manualLoadingRef.current = false
      scrollTriggerManager.setNavigating(false)
      // Update to current pathname
      setCurrentPageName(getPageName(pathname))
    }, 30000) // 30 second fallback for very slow loads
  }

  const completePageLoad = () => {
    console.log(`✅ Page load completed manually`)
    
    // Clear any fallback timeout
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current)
      fallbackTimeoutRef.current = null
    }
    
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setIsPageLoading(false)
      setIsCompiling(false)
      manualLoadingRef.current = false
      scrollTriggerManager.setNavigating(false)
      // Update page name to match current pathname
      setCurrentPageName(getPageName(pathname))
    }, 150)
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
