"use client"

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { pagePreloadManager } from '@/lib/page-preload-manager'

interface PagePreloaderProps {
  isActive: boolean
  onAllPagesReady: () => void
}

export function PagePreloader({ isActive, onAllPagesReady }: PagePreloaderProps) {
  const router = useRouter()
  const hasPreloadedRef = useRef(false)

  const pagesToPreload = [
    { url: '/', name: 'Home' },
    { url: '/about', name: 'About' }, 
    { url: '/blogs', name: 'Blogs' }
  ]

  useEffect(() => {
    if (!isActive || hasPreloadedRef.current) return


    hasPreloadedRef.current = true

    const aggressivelyPreloadPage = async (pageInfo: { url: string, name: string }): Promise<void> => {
      const { url, name } = pageInfo
      
      return new Promise((resolve) => {

        // 1. Next.js router prefetch
        router.prefetch(url)
        
        // 2. Create hidden iframe to FORCE actual page load and compilation
        const iframe = document.createElement('iframe')
        iframe.style.cssText = `
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
          width: 1px !important;
          height: 1px !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          z-index: -9999 !important;
        `
        iframe.setAttribute('aria-hidden', 'true')
        iframe.setAttribute('tabindex', '-1')
        
        const timeoutId = setTimeout(() => {

          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe)
          }
          pagePreloadManager.markPagePreloaded(url)
          resolve()
        }, 15000) // 15 second timeout
        
        iframe.onload = () => {

          clearTimeout(timeoutId)
          pagePreloadManager.markPagePreloaded(url)
          
          // Keep iframe for a bit longer to ensure full compilation
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe)
            }
          }, 2000)
          
          resolve()
        }
        
        iframe.onerror = () => {

          clearTimeout(timeoutId)
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe)
          }
          pagePreloadManager.markPagePreloaded(url) // Mark anyway to prevent blocking
          resolve()
        }
        
        // Add to DOM and set source to trigger load
        document.body.appendChild(iframe)
        iframe.src = url
        

      })
    }

    const preloadEverything = async () => {

      // Preload pages one by one with delays to avoid overwhelming Next.js
      for (const pageInfo of pagesToPreload) {
        await aggressivelyPreloadPage(pageInfo)
        
        // Small delay between preloads to let Next.js process
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      

      // Mark all pages as preloaded
      pagePreloadManager.markAllPagesPreloaded()
      
      // Final delay to ensure everything is settled
      setTimeout(() => {

        onAllPagesReady()
      }, 2000)
    }

    // Start aggressive preloading immediately 
    preloadEverything()

  }, [isActive, router, onAllPagesReady])

  // Hidden prefetch links as additional backup
  return (
    <div style={{ display: 'none', visibility: 'hidden', position: 'absolute', left: '-9999px' }}>
      {pagesToPreload.map((page) => (
        <Link key={page.url} href={page.url} prefetch={true}>
          <span>{page.name}</span>
        </Link>
      ))}
    </div>
  )
}
