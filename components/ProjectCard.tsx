"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

interface Props {
  title: string
  description?: string
  topics?: string[]
  language?: string
  stars?: number
  repoUrl: string
  liveUrl?: string
  poster?: string
  preview?: string
  logo?: string
}

export function ProjectCard({ title, description, topics = [], language, stars, repoUrl, liveUrl, poster, preview, logo }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [canPlay, setCanPlay] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const video = videoRef.current
    if (!video) return
    const st = ScrollTrigger.create({
      trigger: cardRef.current!,
      start: "top bottom",
      end: "bottom top",
      onLeave: () => video.pause(),
      onLeaveBack: () => video.pause(),
    })
    return () => st.kill()
  }, [])

  return (
    <div ref={cardRef} className="project-card bg-card border border-border rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-xl group" data-pointer="interactive">
      {/* Project Header with Logo */}
      <div className="flex items-center gap-3 mb-4">
        {logo && (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 border border-border/50 flex items-center justify-center">
            <img src={logo} alt={`${title} logo`} className="w-8 h-8 object-contain" />
          </div>
        )}
        <div>
          <h3 className="text-xl font-heading font-semibold text-foreground group-hover:text-accent transition-colors duration-200">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{language}</span>
            {typeof stars === "number" && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">⭐ {stars}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {description && <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{description}</p>}
      <div className="aspect-video rounded-lg overflow-hidden bg-black/20 mb-4">
        {preview ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            onMouseEnter={() => { if (videoRef.current) { videoRef.current.play().catch(() => {}) } }}
            onMouseLeave={() => videoRef.current?.pause()}
            onCanPlay={() => setCanPlay(true)}
          >
            <source src={preview} type="video/mp4" />
          </video>
        ) : (
          poster && <img src={poster} alt="Preview" className="w-full h-full object-cover"/>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {topics.slice(0, 3).map((t) => (
          <span key={t} className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium border border-accent/20">{t}</span>
        ))}
      </div>
      
      <div className="flex gap-3">
        <a 
          href={repoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent hover:bg-accent/20 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105"
          data-pointer="interactive"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Code
        </a>
        {liveUrl && (
          <a 
            href={liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            data-pointer="interactive"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15,3 21,3 21,9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Live Demo
          </a>
        )}
      </div>
    </div>
  )
}

