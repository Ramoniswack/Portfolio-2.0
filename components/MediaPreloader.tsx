"use client"

import { useEffect, useState } from "react"

interface MediaPreloaderProps {
  onComplete?: () => void
}

export function MediaPreloader({ onComplete }: MediaPreloaderProps) {
  const [loadedAssets, setLoadedAssets] = useState(0)
  const [totalAssets, setTotalAssets] = useState(0)

  useEffect(() => {
    const mediaAssets = [
      // Videos
      '/clips/aajatasure-clip.mp4',
      '/clips/attendifyplus-clip.mp4',
      '/clips/Gadighar-clip.mp4',
      '/clips/Kharchameter-clip.mp4',
      '/clips/movie-flix-clip.mp4',
      
      // Key images
      '/icons/html-5.png',
      '/icons/css-3.png',
      '/icons/js.png',
      '/icons/typescript.png',
      '/icons/php.png',
      '/icons/mysql-database.png',
      '/icons/mongodb.png',
      '/icons/react.png',
      '/icons/Tailwindcss.png',
      '/icons/zod.png',
      '/icons/java.png',
      '/icons/c-.png',
      '/icons/sql-server.png',
      
      // Logos
      '/logos/attendifyplus.png',
      '/logos/KharchaMeterFull.png',
      '/logos/aajatasure.png',
      '/logos/Gadighar-square.png',
      '/logos/MovieFlix Logo.png',
      
      // Cursors
      '/cursors/cursor.svg',
      '/cursors/pointinghand.svg',
      '/cursors/closedhand.svg',
      
      // Avatar
      'https://avatars.githubusercontent.com/u/131946082?v=4'
    ]

    setTotalAssets(mediaAssets.length)
    let loaded = 0

    const preloadAsset = (src: string) => {
      return new Promise<void>((resolve) => {
        if (src.endsWith('.mp4')) {
          // Preload video
          const video = document.createElement('video')
          video.preload = 'metadata'
          video.onloadedmetadata = () => {
            loaded++
            setLoadedAssets(loaded)
            resolve()
          }
          video.onerror = () => {
            loaded++
            setLoadedAssets(loaded)
            resolve()
          }
          video.src = src
        } else {
          // Preload image
          const img = new Image()
          img.onload = () => {
            loaded++
            setLoadedAssets(loaded)
            resolve()
          }
          img.onerror = () => {
            loaded++
            setLoadedAssets(loaded)
            resolve()
          }
          img.src = src
        }
      })
    }

    // Preload all assets
    Promise.all(mediaAssets.map(preloadAsset)).then(() => {
      onComplete?.()
    })
  }, [onComplete])

  const progress = totalAssets > 0 ? (loadedAssets / totalAssets) * 100 : 0

  return null // This is a utility component, no UI needed
}

// Hook for media preloading status
export function useMediaPreloader() {
  const [isPreloading, setIsPreloading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const preloader = document.createElement('div')
    document.body.appendChild(preloader)

    // Track preloading with a custom event system
    const handlePreloadComplete = () => {
      setIsPreloading(false)
      setProgress(100)
    }

    // Start preloading after component mount
    const timer = setTimeout(() => {
      handlePreloadComplete()
    }, 2000) // Fallback timeout

    return () => {
      clearTimeout(timer)
      if (preloader.parentNode) {
        preloader.parentNode.removeChild(preloader)
      }
    }
  }, [])

  return { isPreloading, progress }
}
