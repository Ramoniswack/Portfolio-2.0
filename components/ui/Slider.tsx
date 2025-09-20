"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useInViewOnce } from '@/lib/useInViewOnce'

/**
 * Slider
 * Lightweight carousel wrapper using embla-carousel-react (already installed).
 * - Autoplay with sensible defaults
 * - Pause on hover/focus
 * - Lazy images via next/image
 * - Accessible prev/next buttons + pagination dots
 *
 * Props:
 * - slides: array of { key?, image?: { src, alt, width?, height? }, content?: ReactNode }
 * - loop: boolean
 * - autoplay: number | false (ms)
 * - slidesToScroll: number
 * - className: string
 *
 * How to use:
 * <Slider slides={[{ image: { src: '/img.jpg', alt: 'a' } }, { content: <div>...</div> }]} />
 */

type SlideItem = {
  key?: string | number
  image?: { src: string; alt?: string; width?: number; height?: number }
  content?: React.ReactNode
}

type SliderProps = {
  slides: SlideItem[]
  loop?: boolean
  autoplay?: number | false
  slidesToScroll?: number
  className?: string
}

export default function Slider({
  slides,
  loop = true,
  autoplay = 4000,
  slidesToScroll = 1,
  className = ''
}: SliderProps) {
  const [containerRef, isInView] = useInViewOnce({ rootMargin: '200px' })
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align: 'center' })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const autoplayRef = useRef<number | null>(null)
  const isHoveredRef = useRef(false)

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()
    return () => {
      if (emblaApi) emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  // Autoplay loop using setInterval but only start when in view and not reduced-motion
  useEffect(() => {
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const delay = typeof autoplay === 'number' && autoplay > 0 ? autoplay : null
    if (!delay || prefersReduced) return

    function start() {
      if (autoplayRef.current) return
      const numericDelay = delay as number
      autoplayRef.current = window.setInterval(() => {
        if (!isHoveredRef.current) scrollNext()
      }, numericDelay)
    }
    function stop() {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
    }

    if (isInView) start()
    else stop()

    const onVis = () => {
      if (document.hidden) stop()
      else if (isInView) start()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [autoplay, scrollNext, isInView])

  return (
    <div
      ref={containerRef as any}
      className={`relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-neutral-900/10 ${className}`}
      onMouseEnter={() => (isHoveredRef.current = true)}
      onMouseLeave={() => (isHoveredRef.current = false)}
    >
      <div className="embla h-full" ref={emblaRef as any}>
        <div className="embla__container flex h-full">
          {slides.map((s, i) => (
            <div key={s.key ?? i} className="embla__slide flex-shrink-0 w-full h-full">
              {s.image ? (
                <div className="w-full h-full relative">
                  <Image
                    src={s.image.src}
                    alt={s.image.alt ?? ''}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg"
                    priority={i === 0}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">{s.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-y-1/2 left-2 transform -translate-y-1/2">
        <button
          aria-label="Previous"
          onClick={scrollPrev}
          className="p-2 rounded-full bg-white/90 shadow-md hover:bg-white"
        >
          ‹
        </button>
      </div>
      <div className="absolute inset-y-1/2 right-2 transform -translate-y-1/2">
        <button
          aria-label="Next"
          onClick={scrollNext}
          className="p-2 rounded-full bg-white/90 shadow-md hover:bg-white"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="absolute left-1/2 bottom-3 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`w-2 h-2 rounded-full ${i === selectedIndex ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  )
}
