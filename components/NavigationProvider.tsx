"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { WavePageTransition } from './WavePageTransition'

interface NavigationContextType {
  navigateWithTransition: (path: string, colorScheme?: string) => void
  isTransitioning: boolean
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

interface NavigationProviderProps {
  children: ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentColorScheme, setCurrentColorScheme] = useState<'blue' | 'purple' | 'emerald' | 'orange' | 'pink'>('blue')

  const navigateWithTransition = useCallback((path: string, colorScheme: string = 'blue') => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setCurrentColorScheme(colorScheme as any)

    // Faster navigation - start routing immediately with wave overlay
    router.push(path)
    
    // Shorter delay for better performance
    setTimeout(() => {
      setIsTransitioning(false)
    }, 800) // Reduced from 1500ms to 800ms
  }, [router, isTransitioning])

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false)
  }, [])

  return (
    <NavigationContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {children}
      <WavePageTransition 
        isActive={isTransitioning}
        direction="enter"
        colorScheme={currentColorScheme}
        onComplete={handleTransitionComplete}
      />
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
