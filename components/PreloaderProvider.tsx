"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { SimplePreloader } from './SimplePreloader'

interface PreloaderContextType {
  shouldShowPreloader: boolean
  setPreloaderComplete: () => void
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined)

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [shouldShowPreloader, setShouldShowPreloader] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    if (hasChecked) return // Only check once per session
    
    if (typeof window !== 'undefined') {
      // Check if this is a page refresh (F5 or hard refresh)
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const isPageRefresh = navigationEntry && navigationEntry.type === 'reload'
      
      // Check if this is the very first time visiting the site (fresh browser session)
      const hasEverStartedSession = sessionStorage.getItem('sessionStarted')
      
      console.log('=== PRELOADER PROVIDER DEBUG ===')
      console.log('Navigation type:', navigationEntry?.type)
      console.log('Is page refresh:', isPageRefresh)
      console.log('Has ever started session:', hasEverStartedSession)
      
      // Show preloader only on page refresh OR very first session start
      if (isPageRefresh || !hasEverStartedSession) {
        setShouldShowPreloader(true)
        console.log('✅ Showing preloader with page preloading')
      } else {
        console.log('❌ Not showing preloader (internal navigation)')
      }
      
      // Mark that session has started
      sessionStorage.setItem('sessionStarted', 'true')
      setHasChecked(true)
      
      console.log('=== END PROVIDER DEBUG ===')
    }
  }, [hasChecked])

  const setPreloaderComplete = () => {
    console.log('🎬 Preloader marked as complete, hiding...')
    setShouldShowPreloader(false)
    // Enable scrolling when preloader completes
    document.body.style.overflow = "auto"
  }

  // Prevent scrolling during preloader
  useEffect(() => {
    if (shouldShowPreloader) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [shouldShowPreloader])

  return (
    <PreloaderContext.Provider value={{ shouldShowPreloader, setPreloaderComplete }}>
      {/* Render the SimplePreloader when needed */}
      {shouldShowPreloader && (
        <SimplePreloader onComplete={setPreloaderComplete} />
      )}
      {children}
    </PreloaderContext.Provider>
  )
}

export function usePreloader() {
  const context = useContext(PreloaderContext)
  if (context === undefined) {
    throw new Error('usePreloader must be used within a PreloaderProvider')
  }
  return context
}
