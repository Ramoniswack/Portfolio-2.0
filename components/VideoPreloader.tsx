"use client"

import { useEffect, useRef } from 'react'
import { pagePreloadManager } from '@/lib/page-preload-manager'

interface VideoPreloaderProps {
  isActive: boolean
  onVideosReady: () => void
}

export function VideoPreloader({ isActive, onVideosReady }: VideoPreloaderProps) {
  const hasPreloadedRef = useRef(false)

  const videosToPreload = [
    '/clips/aajatasure-clip.mp4',
    '/clips/attendifyplus-clip.mp4', 
    '/clips/Gadighar-clip.mp4',
    '/clips/Kharchameter-clip.mp4',
    '/clips/movie-flix-clip.mp4'
  ]

  useEffect(() => {
    if (!isActive || hasPreloadedRef.current) return

    console.log('🎥 Starting video preloading during greeting phase...')
    hasPreloadedRef.current = true

    const preloadVideo = async (videoSrc: string): Promise<void> => {
      return new Promise((resolve) => {
        console.log(`📹 Preloading video: ${videoSrc}`)
        
        const video = document.createElement('video')
        video.preload = 'metadata' // Load metadata but not full video for performance
        video.muted = true
        video.playsInline = true
        
        const handleCanPlay = () => {
          console.log(`✅ Video metadata loaded: ${videoSrc}`)
          pagePreloadManager.markVideoPreloaded(videoSrc)
          cleanup()
          resolve()
        }

        const handleError = () => {
          console.log(`❌ Failed to preload video: ${videoSrc}`)
          cleanup()
          resolve()
        }

        const cleanup = () => {
          video.removeEventListener('canplay', handleCanPlay)
          video.removeEventListener('error', handleError)
          video.src = ''
          video.load() // Reset video element
        }

        video.addEventListener('canplay', handleCanPlay)
        video.addEventListener('error', handleError)
        
        // Start preloading
        video.src = videoSrc
        video.load()

        // Timeout after 5 seconds to prevent hanging
        setTimeout(() => {
          if (video.readyState < 2) { // Less than HAVE_CURRENT_DATA
            console.log(`⏰ Video preload timeout: ${videoSrc}`)
            cleanup()
            resolve()
          }
        }, 5000)
      })
    }

    const preloadAllVideos = async () => {
      console.log(`🎬 Preloading ${videosToPreload.length} videos...`)
      
      // Preload videos with limited concurrency to avoid overwhelming
      const batchSize = 2 // Preload 2 videos at a time
      for (let i = 0; i < videosToPreload.length; i += batchSize) {
        const batch = videosToPreload.slice(i, i + batchSize)
        const batchPromises = batch.map(videoSrc => preloadVideo(videoSrc))
        
        await Promise.all(batchPromises)
        
        // Small delay between batches
        if (i + batchSize < videosToPreload.length) {
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      }
      
      console.log(`🎉 All ${videosToPreload.length} videos preloaded!`)
      
      // Mark all videos as preloaded in the global manager
      pagePreloadManager.markAllVideosPreloaded()
      
      // Notify completion
      setTimeout(() => {
        console.log(`🚀 Video preloading complete!`)
        onVideosReady()
      }, 100)
    }

    // Start video preloading with slight delay to let page preloading start first
    setTimeout(() => {
      preloadAllVideos()
    }, 800)

  }, [isActive, onVideosReady])

  // Hidden video elements for additional browser caching
  return (
    <div style={{ display: 'none', visibility: 'hidden', position: 'absolute', left: '-9999px' }}>
      {videosToPreload.map((videoSrc, index) => (
        <video 
          key={videoSrc}
          preload="metadata"
          muted
          playsInline
          style={{ width: '1px', height: '1px' }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ))}
    </div>
  )
}
