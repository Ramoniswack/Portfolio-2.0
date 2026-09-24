"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { ExternalLink, Github, Star } from "lucide-react"
import Image from "next/image"
import { useInViewOnce } from '@/lib/useInViewOnce'

interface AlternatingProjectCardProps {
  title: string
  description: string
  details?: string
  topics: string[]
  language: string
  stars: number
  repoUrl: string
  liveUrl?: string
  logo: string
  videoClip?: string
  screenshots?: string[]
  poster?: string
  isMobile?: boolean
  isReversed?: boolean
}

export function AlternatingProjectCard({
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
  screenshots,
  poster,
  isMobile = false,
  isReversed = false
}: AlternatingProjectCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const scrollContentRef = useRef<HTMLDivElement | null>(null)
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [inViewRef, nearView] = useInViewOnce({ rootMargin: '200px' })

  // Animation state
  const isHoveredRef = useRef(false)
  const currentTranslateYRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    ;(inViewRef as any).current = containerRef.current
  }, [inViewRef])

  const ensureSourceLoaded = useCallback(() => {
    const v = videoRef.current
    if (!v || isLoaded || !videoClip) return
    try {
      while (v.firstChild) v.removeChild(v.firstChild)
      
      const webmSrc = videoClip.replace('.mp4', '.webm')
      const sourceWebm = document.createElement('source')
      sourceWebm.src = webmSrc
      sourceWebm.type = 'video/webm'
      v.appendChild(sourceWebm)
      
      const sourceMp4 = document.createElement('source')
      sourceMp4.src = videoClip
      sourceMp4.type = 'video/mp4'
      v.appendChild(sourceMp4)
      
      v.load()
    } catch (e) {

    }
  }, [videoClip, isLoaded])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onLoadedData = () => setIsLoaded(true)
    v.addEventListener('loadeddata', onLoadedData)
    return () => v.removeEventListener('loadeddata', onLoadedData)
  }, [])

  const animateScroll = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time
    const deltaTime = time - lastTimeRef.current
    lastTimeRef.current = time

    if (isHoveredRef.current && scrollContentRef.current && scrollContainerRef.current) {
      const maxScroll = scrollContentRef.current.clientHeight - scrollContainerRef.current.clientHeight
      
      if (maxScroll > 0) {
        // Scroll speed: pixels per millisecond (approx 12 seconds to scroll a typical full length)
        const speed = maxScroll / 12000
        currentTranslateYRef.current -= speed * deltaTime

        if (currentTranslateYRef.current <= -maxScroll) {
          currentTranslateYRef.current = 0 // Instant loop back to top!
        }
        
        scrollContentRef.current.style.transform = `translateY(${currentTranslateYRef.current}px)`
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(animateScroll)
  }, [])

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animateScroll)
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [animateScroll])

  const handleMouseOver = useCallback(() => {
    isHoveredRef.current = true
    lastTimeRef.current = null
    
    // Reset if it was already at the end
    if (scrollContentRef.current && scrollContainerRef.current) {
      const maxScroll = scrollContentRef.current.clientHeight - scrollContainerRef.current.clientHeight
      // Use a 10px buffer in case of fractional pixels or slight layout shifts
      if (currentTranslateYRef.current <= -maxScroll + 10) {
        currentTranslateYRef.current = 0
        scrollContentRef.current.style.transform = `translateY(0px)`
      }
    }

    ensureSourceLoaded()
    const v = videoRef.current
    if (v) {
      v.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }, [ensureSourceLoaded])

  const handleMouseOut = useCallback(() => {
    isHoveredRef.current = false
    lastTimeRef.current = null
    
    const v = videoRef.current
    if (v) {
      v.pause()
      v.currentTime = 0
      setIsPlaying(false)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex flex-col group h-full"
    >
      {/* Media Top Side */}
      <div 
        className={`w-full relative overflow-hidden bg-[#050505] border border-border/10 rounded-lg mb-5 ${
          isMobile ? 'aspect-[9/16] max-w-[280px] mx-auto' : 'aspect-[4/3] lg:aspect-video'
        }`}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <div ref={scrollContainerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
          {poster && (
            <div className="absolute inset-0 z-10 transition-opacity duration-500 group-hover:opacity-0 pointer-events-none">
              <Image 
                src={poster} 
                alt={`${title} poster`} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized 
                quality={100} 
                className="object-cover" 
              />
            </div>
          )}
          {screenshots && screenshots.length > 0 ? (
            <div className="absolute inset-0">
              <div 
                ref={scrollContentRef}
                className="w-full flex flex-col"
              >
                {screenshots.map((src, i) => (
                  <div key={i} className="relative w-full">
                    <img
                      src={src}
                      alt={`${title} screenshot ${i + 1}`}
                      className="w-full h-auto block"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-90"
              loop
              muted
              playsInline
              preload="metadata"
            />
          )}
        </div>
        
        {/* Play indicator */}
        {!(screenshots && screenshots.length > 0) && (
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isPlaying ? 'opacity-0' : 'opacity-100 bg-black/40'}`}>
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/20">
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Content Bottom Side */}
      <div className="flex flex-col px-1 flex-grow">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 relative opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <Image
                src={logo}
                alt={`${title} logo`}
                fill
                sizes="24px"
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {title}
            </h3>
          </div>
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-sm font-medium mt-0.5 flex-shrink-0"
              title="Visit Website"
            >
              Visit <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {details || description}
        </p>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-auto">
          {topics.map((topic) => (
            <span
              key={topic}
              className="text-xs font-mono text-muted-foreground/80 uppercase tracking-widest"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
