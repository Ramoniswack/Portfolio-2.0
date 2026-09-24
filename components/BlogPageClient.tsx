'use client'

import { useEffect } from 'react'
import { useCompilation } from '@/components/CompilationProvider'

interface BlogPageClientProps {
  children: React.ReactNode
}

export function BlogPageClient({ children }: BlogPageClientProps) {
  const { completePageLoad } = useCompilation()

  useEffect(() => {

    // More aggressive waiting for blog page readiness
    const waitForPageReady = () => {
      const isDocumentComplete = document.readyState === 'complete'
      const hasCorrectContent = document.querySelector('[data-page="blogs"]') !== null
      const hasMainContent = document.querySelector('main') !== null
      const hasCorrectURL = window.location.pathname.includes('/blogs')
      
      const isContentReady = isDocumentComplete && 
                           hasCorrectContent && 
                           hasMainContent && 
                           hasCorrectURL
      

      if (!isContentReady) {
        setTimeout(waitForPageReady, 200)
        return
      }
      
      // Wait for stability before completing

      setTimeout(() => {
        // Final verification
        const finalCheck = document.querySelector('[data-page="blogs"]') !== null &&
                          window.location.pathname.includes('/blogs') &&
                          document.readyState === 'complete'
        
        if (finalCheck) {

          completePageLoad()
        } else {

          setTimeout(waitForPageReady, 500)
        }
      }, 600)
    }
    
    // Start checking after initial delay
    setTimeout(() => {
      waitForPageReady()
    }, 300)
  }, [completePageLoad])

  return <>{children}</>
}
