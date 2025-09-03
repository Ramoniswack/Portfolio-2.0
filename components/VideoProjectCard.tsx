"use client"

import React from "react"
import { ExternalLink, Github, Star } from "lucide-react"
import Image from "next/image"
import { useVideoLoader } from "@/hooks/useVideoLoader"

interface VideoProjectCardProps {
  title: string
  description: string
  topics: string[]
  language: string
  stars: number
  repoUrl: string
  liveUrl?: string
  logo: string
  videoClip: string
  isMobile?: boolean
}

export function VideoProjectCard({
  title,
  description,
  topics,
  language,
  stars,
  repoUrl,
  liveUrl,
  logo,
  videoClip,
  isMobile = false
}: VideoProjectCardProps) {
  const {
    videoRef,
    isLoaded,
    isError,
    isInView,
    handleLoadedData,
    handleError,
    handleCanPlay
  } = useVideoLoader({
    src: videoClip,
    preload: 'auto',
    autoplay: true,
    threshold: 0.1
  })

  return (
    <div 
      className={`group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-accent/30 ${
        isMobile ? 'aspect-[9/16] max-w-[280px] mx-auto' : 'aspect-[16/10]'
      }`}
      data-pointer="interactive"
    >
      {/* Video Background */}
      <div className="absolute inset-0 bg-muted/20 video-container">
        {!isError ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover transition-transform duration-500"
            loop
            muted
            playsInline
            preload="metadata"
            loading="lazy"
            onLoadedData={handleLoadedData}
            onCanPlay={handleCanPlay}
            onError={handleError}
            style={{ backgroundColor: '#1f2937' }}
          >
            <source src={videoClip} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          // Fallback for video error
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-muted-foreground text-sm mb-2">Preview unavailable</div>
              <div className="text-xs text-muted-foreground/70">Click to view project</div>
            </div>
          </div>
        )}
        
        {/* Loading overlay with enhanced visual feedback */}
        {!isLoaded && !isError && (
          <div className="absolute inset-0 bg-gradient-to-br from-muted/90 to-muted/70 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-3 border-accent/30 rounded-full"></div>
                <div className="absolute inset-0 w-12 h-12 border-3 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground text-sm font-medium mb-1">Loading preview</div>
                <div className="text-muted-foreground/70 text-xs">Please wait...</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />
      </div>

      {/* Project Info Overlay */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        {/* Top Section - Logo and Title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/90 p-2 shadow-lg flex-shrink-0">
            <Image
              src={logo}
              alt={`${title} logo`}
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <span className="px-2 py-1 bg-white/20 rounded-md text-xs font-medium">
                {language}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span>{stars}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Description only visible on hover */}
        <div className={`flex-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center ${
          isMobile ? 'py-1' : 'py-2'
        }`}>
          <p className={`text-white font-medium drop-shadow-lg backdrop-blur-sm bg-black/50 rounded-lg ${
            isMobile 
              ? 'text-xs leading-tight line-clamp-5 px-3 py-2' 
              : 'text-sm leading-relaxed line-clamp-3 p-3'
          }`}>
            {description}
          </p>
        </div>

        {/* Bottom Section - Topics and Actions */}
        <div className="space-y-3">
          {/* Topics */}
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

          {/* Action Buttons */}
          <div className="flex gap-2">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-200 rounded-lg text-sm font-medium"
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
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-accent/90 backdrop-blur-sm text-accent-foreground hover:bg-accent transition-colors duration-200 rounded-lg text-sm font-medium"
                data-pointer="interactive"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}
