"use client"

import { useEffect, useState } from 'react'

export function HoverHint({ className = '' }: { className?: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // show after 2.5s or on first scroll, whichever comes first
    const timeout = window.setTimeout(() => setVisible(true), 2500)
    const onScroll = () => {
      setVisible(true)
      window.removeEventListener('scroll', onScroll)
      clearTimeout(timeout)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <p
      className={`hover-hint text-sm text-muted-foreground/70 transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'} ${className}`}
      aria-hidden={!visible}
    >
      Hover over project previews to play videos
    </p>
  )
}
