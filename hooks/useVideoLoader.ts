"use client"

import { useEffect, useState, useRef } from 'react'

interface UseVideoLoaderProps {
  src: string
  preload?: 'auto' | 'metadata' | 'none'
  autoplay?: boolean
  threshold?: number
}

export function useVideoLoader({ 
  src, 
  preload = 'auto', 
  autoplay = true,
  threshold = 0.2 
}: UseVideoLoaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [playAttempted, setPlayAttempted] = useState(false)

  // Preload video
  useEffect(() => {
    const video = new Image() // Use Image for initial loading
    video.onload = () => setIsLoaded(true)
    video.onerror = () => setIsError(true)
    
    // For videos, we need to create a video element to preload
    const videoElement = document.createElement('video')
    videoElement.preload = preload
    videoElement.muted = true
    videoElement.onloadeddata = () => setIsLoaded(true)
    videoElement.onerror = () => setIsError(true)
    videoElement.src = src
    
    return () => {
      videoElement.onloadeddata = null
      videoElement.onerror = null
    }
  }, [src, preload])

  // Intersection Observer for autoplay
  useEffect(() => {
    if (!autoplay) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
        
        if (entry.isIntersecting && videoRef.current && isLoaded && !playAttempted) {
          setPlayAttempted(true)
          
          // Small delay to ensure smooth playback
          setTimeout(() => {
            videoRef.current?.play().catch((error) => {
              console.warn('Video autoplay failed:', error)
              
              // Retry on user interaction
              const handleInteraction = () => {
                videoRef.current?.play().catch(() => {})
                document.removeEventListener('click', handleInteraction)
                document.removeEventListener('touchstart', handleInteraction)
              }
              
              document.addEventListener('click', handleInteraction, { once: true })
              document.addEventListener('touchstart', handleInteraction, { once: true })
            })
          }, 200)
        } else if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause()
          setPlayAttempted(false)
        }
      },
      { 
        threshold,
        rootMargin: '100px' // Start loading before fully visible
      }
    )

    const currentVideo = videoRef.current
    if (currentVideo) {
      observer.observe(currentVideo)
    }

    return () => {
      if (currentVideo) {
        observer.unobserve(currentVideo)
      }
    }
  }, [autoplay, isLoaded, playAttempted, threshold])

  const handleLoadedData = () => {
    setIsLoaded(true)
    setIsError(false)
  }

  const handleError = () => {
    setIsError(true)
    setIsLoaded(false)
  }

  const handleCanPlay = () => {
    setIsLoaded(true)
    if (isInView && autoplay && !playAttempted) {
      setPlayAttempted(true)
      videoRef.current?.play().catch(console.warn)
    }
  }

  return {
    videoRef,
    isLoaded,
    isError,
    isInView,
    handleLoadedData,
    handleError,
    handleCanPlay
  }
}
