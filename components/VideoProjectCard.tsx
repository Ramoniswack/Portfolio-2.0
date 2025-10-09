"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { ExternalLink, Github, Star } from "lucide-react"
import Image from "next/image"
import { setActiveVideo, clearActiveVideo } from "@/lib/video-manager"
import { useInViewOnce } from '@/lib/useInViewOnce'
import DetailsPopup from './ui/DetailsPopup'

interface VideoProjectCardProps {
  title: string
  description: string
  details?: string
  topics: string[]
  language: string
  stars: number
  repoUrl: string
  liveUrl?: string
  logo: string
  videoClip: string
  poster?: string
  isMobile?: boolean
}

export function VideoProjectCard({
  title,
  description,
  details,
  topics,
  language,
  stars,
  repoUrl,
  liveUrl,
  logo,
  videoClip,
  poster,
  isMobile = false
}: VideoProjectCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const clickTimeoutRef = useRef<number | null>(null)

  // Simple handler to open details modal
  const handleOpenDetails = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setDetailsOpen(true)
  }, [])

  // Simple handler to close details modal
  const handleCloseDetails = useCallback(() => {
    setDetailsOpen(false)
  }, [])

  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  // sourceRef removed - we'll set video.src directly for reliability
  const hoverTimeoutRef = useRef<number | null>(null)
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null)
  const clearSrcTimeoutRef = useRef<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [inViewRef, nearView] = useInViewOnce({ rootMargin: '200px' })

  // attach both refs
  useEffect(() => {
    if (!containerRef.current) return
    ;(inViewRef as any).current = containerRef.current
  }, [inViewRef])

  // Lazy-load the video source when needed
  const ensureSourceLoaded = useCallback(() => {
    const v = videoRef.current
    if (!v || isLoaded) return
    try {
      console.debug('[VideoProjectCard] ensureSourceLoaded - assigning sources', { videoClip })
      
      // Clear existing sources
      while (v.firstChild) v.removeChild(v.firstChild)
      
      // Add WebM source if available (better compression)
      const webmSrc = videoClip.replace('.mp4', '.webm')
      const sourceWebm = document.createElement('source')
      sourceWebm.src = webmSrc
      sourceWebm.type = 'video/webm'
      v.appendChild(sourceWebm)
      
      // Add MP4 source as fallback (universal compatibility)
      const sourceMp4 = document.createElement('source')
      sourceMp4.src = videoClip
      sourceMp4.type = 'video/mp4'
      v.appendChild(sourceMp4)
      
      // load metadata
      v.load()
    } catch (e) {
      console.error('[VideoProjectCard] ensureSourceLoaded error', e)
    }
  }, [videoClip, isLoaded])

  const playVideo = useCallback(async (force = false) => {
    const el = videoRef.current
    if (!el || isPlaying || isError) return
    // Detect touch devices more conservatively
    let isTouchDevice = false
    try {
      if (typeof window !== 'undefined') {
        isTouchDevice = Boolean(navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || ('ontouchstart' in window)
      }
    } catch (e) {
      isTouchDevice = false
    }
  // If force (hover/click user intent) is set, allow playback even for mobile-sized cards on desktop
  if (isMobile && isTouchDevice && !force) return
    try { el.muted = true } catch (e) {}
    console.debug('[VideoProjectCard] playVideo start', { isInView, isLoaded })
    // cancel any pending clear-src
    if (clearSrcTimeoutRef.current) {
      window.clearTimeout(clearSrcTimeoutRef.current)
      clearSrcTimeoutRef.current = null
    }
    // Ensure src assigned (stronger guarantee than source element)
    try {
      // Check if sources are already loaded
      if (el.childElementCount === 0) {
        ensureSourceLoaded()
      }
      el.load()
    } catch (e) {
      console.error('[VideoProjectCard] error loading video before play', e)
    }
    try {
      const playPromise = el.play()
      if (playPromise !== undefined) await playPromise
      console.debug('[VideoProjectCard] playVideo played')
      setActiveVideo(el)
      setIsPlaying(true)
    } catch (err) {
      console.warn('[VideoProjectCard] Preview play rejected', err, { readyState: el.readyState, error: el.error })
    }
  }, [ensureSourceLoaded, isPlaying, isError, isMobile, videoClip, isInView, isLoaded])

  const pauseVideo = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    try {
      console.debug('[VideoProjectCard] pauseVideo')
      el.pause()
      el.currentTime = 0
    } catch (e) {
      console.error('[VideoProjectCard] pauseVideo error', e)
    }
    clearActiveVideo(el)
    setIsPlaying(false)
  }, [])

  // Hover handlers with 120ms delay
  const handleMouseOver = useCallback(() => {
    // allow hover triggers on desktop even if the card is flagged `isMobile`
    let isTouchDevice = false
    try {
      if (typeof window !== 'undefined') {
        isTouchDevice = Boolean(navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || ('ontouchstart' in window)
      }
    } catch (e) {
      isTouchDevice = false
    }
    if (isMobile && isTouchDevice) return
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current)
    // start loading immediately so metadata is ready by the delayed play
    try {
      console.debug('[VideoProjectCard] mouseover - trigger ensureSourceLoaded')
      ensureSourceLoaded()
      if (videoRef.current) {
        try { videoRef.current.preload = 'metadata' } catch (e) {}
        try { videoRef.current.muted = true } catch (e) {}
      }
    } catch (e) {}

    hoverTimeoutRef.current = window.setTimeout(() => {
      playVideo(true)
    }, 120)
  }, [playVideo, isMobile])

  const handleMouseOut = useCallback(() => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    window.setTimeout(() => {
      pauseVideo()
    }, 100)
  }, [pauseVideo])

  // IntersectionObserver to load metadata when card enters viewport
  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    intersectionObserverRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true)
          ensureSourceLoaded()
          // cancel pending clear-src
          if (clearSrcTimeoutRef.current) {
            window.clearTimeout(clearSrcTimeoutRef.current)
            clearSrcTimeoutRef.current = null
          }
        } else {
          setIsInView(false)
          pauseVideo()
          // delay clearing src to avoid racing with a hover/click that may happen immediately after leaving
          try {
            if (videoRef.current) {
              if (clearSrcTimeoutRef.current) window.clearTimeout(clearSrcTimeoutRef.current)
              clearSrcTimeoutRef.current = window.setTimeout(() => {
                try {
                  console.debug('[VideoProjectCard] clearing video src to free resources (delayed)')
                  if (videoRef.current) {
                    videoRef.current.removeAttribute('src')
                    while (videoRef.current.firstChild) videoRef.current.removeChild(videoRef.current.firstChild)
                    videoRef.current.load()
                    setIsLoaded(false)
                    clearSrcTimeoutRef.current = null
                  }
                } catch (e) {
                  console.error('[VideoProjectCard] error clearing src (delayed)', e)
                }
              }, 750)
            }
          } catch (e) {
            console.error('[VideoProjectCard] error scheduling clear src', e)
          }
        }
      })
    }, { threshold: 0.2, rootMargin: '200px' })

    intersectionObserverRef.current.observe(el)

    return () => {
      intersectionObserverRef.current?.disconnect()
      intersectionObserverRef.current = null
      if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current)
    }
  }, [ensureSourceLoaded, pauseVideo])

  // Video event handlers for load / error
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onLoadedData = () => setIsLoaded(true)
    const onError = () => setIsError(true)
    v.addEventListener('loadeddata', onLoadedData)
    v.addEventListener('error', onError)
    return () => {
      v.removeEventListener('loadeddata', onLoadedData)
      v.removeEventListener('error', onError)
    }
  }, [])

  // Cleanup active video on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current)
      if (clickTimeoutRef.current) window.clearTimeout(clickTimeoutRef.current)
      pauseVideo()
    }
  }, [pauseVideo])

  // Handle card click with debouncing
  const handleCardClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement | null
    
    // If click landed on interactive control (links/buttons), let them handle it
    if (target && (target.closest('a') || target.closest('button') || target.closest('[role="button"]'))) {
      return
    }

    // Prevent multiple rapid clicks
    if (clickTimeoutRef.current) return
    
    e.stopPropagation()
    
    // Mobile behavior: play video on click
    if (isMobile) {
      const videoEl = videoRef.current
      if (videoEl && target && target.closest('.video-container')) {
        clickTimeoutRef.current = window.setTimeout(() => {
          clickTimeoutRef.current = null
        }, 300)
        
        try {
          ensureSourceLoaded()
          if (isPlaying) {
            pauseVideo()
          } else {
            playVideo(true)
          }
        } catch (err) {
          console.error('Error toggling video playback:', err)
        }
      }
      return
    }

    // Desktop: clicking video plays it
    if (target && target.closest('video')) {
      clickTimeoutRef.current = window.setTimeout(() => {
        clickTimeoutRef.current = null
      }, 300)
      
      try {
        ensureSourceLoaded()
        playVideo(true)
      } catch (err) {
        console.error('Error playing video:', err)
      }
    }
  }, [isMobile, isPlaying, ensureSourceLoaded, playVideo, pauseVideo])

  return (
    <div
      ref={containerRef}
      className={`group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-accent/30 transform-gpu will-change-transform ${
        isMobile ? 'aspect-[9/16] max-w-[280px] mx-auto' : 'aspect-[16/10]'
      }`}
      data-pointer="interactive"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={handleCardClick}
    >
      {/* Hovered description bubble — positioned above/outside the video */}
      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-[90%] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-card/90 text-sm text-muted-foreground p-3 rounded-lg shadow-lg backdrop-blur-sm">
          {details || description}
        </div>
      </div>
      {/* Video Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 video-container pointer-events-none">
        {!isError ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover transition-transform duration-500 transform-gpu will-change-transform,opacity"
            loop
            muted
            playsInline
            preload="metadata"
            poster={poster}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white/60 text-sm mb-2">Preview unavailable</div>
              <div className="text-xs text-white/40">Click to view project</div>
            </div>
          </div>
        )}

        {/* Subtle gradient overlay for text readability - only on bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Project Info Overlay */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/90 p-2 shadow-lg flex-shrink-0">
            <Image
              src={logo}
              alt={`${title} logo`}
              width={48}
              height={48}
              className="w-full h-full object-contain"
              loading="eager"
              quality={90}
            />
          </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                <span className="px-2 py-1 bg-white/20 rounded-md text-xs font-medium">
                  {language}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  <span>{stars}</span>
                </div>
              </div>
              {/* description intentionally removed to avoid hover paints */}
            </div>
        </div>

        {/* Description removed to reduce render/paint costs during hover */}

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white/90 text-xs rounded-md font-medium"
              >
                {topic}
              </span>
            ))}
            {topics.length > 3 && (
              <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white/90 text-xs rounded-md font-medium">
                +{topics.length - 3}
              </span>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-2 px-3 ${isMobile ? 'py-1.5 text-xs min-h-[36px]' : 'py-2 text-sm min-h-[44px]'} bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-200 rounded-lg font-medium`}
              data-pointer="interactive"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-4 h-4" />
              Code
            </a>
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 px-3 ${isMobile ? 'py-1.5 text-xs min-h-[36px]' : 'py-2 text-sm min-h-[44px]'} bg-accent/90 backdrop-blur-sm text-accent-foreground hover:bg-accent transition-colors duration-200 rounded-lg font-medium`}
                data-pointer="interactive"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
            {/* Details button opens a modal with extended info */}
            <div className={`${isMobile ? 'min-h-[36px]' : ''}`}>
              <button
                onClick={handleOpenDetails}
                className="px-3 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 active:bg-white/30 transition-colors w-full"
                data-pointer="interactive"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Details Modal - Rendered at the end, outside the card content */}
      <DetailsPopup open={detailsOpen} onClose={handleCloseDetails} title={title}>
        {details || description}
      </DetailsPopup>
    </div>
  )
}
