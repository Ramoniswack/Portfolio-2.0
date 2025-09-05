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

    console.log('🚀 Starting advanced page preloading during greeting phase...')
    hasPreloadedRef.current = true

    const preloadPage = async (pageInfo: { url: string, name: string }): Promise<void> => {
      const { url, name } = pageInfo
      
      return new Promise((resolve) => {
        console.log(`📥 Preloading ${name}: ${url}`)
        
        // 1. Use Next.js router prefetch (most important)
        router.prefetch(url)
        
        // 2. Fetch the page content to warm up the cache
        fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Cache-Control': 'max-age=3600'
          }
        })
        .then(response => {
          if (response.ok) {
            console.log(`✅ Successfully preloaded ${name}`)
            pagePreloadManager.markPagePreloaded(url)
          } else {
            console.log(`⚠️ ${name} preload got status ${response.status}`)
          }
        })
        .catch(error => {
          console.log(`❌ Failed to preload ${name}:`, error)
        })
        .finally(() => {
          resolve()
        })
      })
    }

    const preloadResources = async () => {
      console.log(`📚 Preloading ${pagesToPreload.length} pages and resources...`)
      
      // 1. Preload critical resources first
      const criticalResources = [
        '/favicon.ico',
        '/android-chrome-512x512.png',
      ]

      // Preload critical resources
      criticalResources.forEach(resource => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = resource
        link.as = resource.endsWith('.css') ? 'style' : 'image'
        document.head.appendChild(link)
      })

      // 2. Preload pages concurrently for speed
      const preloadPromises = pagesToPreload.map(pageInfo => preloadPage(pageInfo))
      
      try {
        await Promise.all(preloadPromises)
        console.log(`🎉 All ${pagesToPreload.length} pages preloaded successfully!`)
        
        // Mark all pages as preloaded in the global manager
        pagePreloadManager.markAllPagesPreloaded()
        
      } catch (error) {
        console.log(`⚠️ Some pages failed to preload, but continuing...`, error)
      }
      
      // 3. Notify completion
      setTimeout(() => {
        console.log(`🔥 Page preloading complete - navigation should be instant!`)
        onAllPagesReady()
      }, 100)
    }

    // Start preloading immediately
    preloadResources()

  }, [isActive, router, onAllPagesReady])

  // Hidden prefetch links as backup (Next.js best practice)
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
