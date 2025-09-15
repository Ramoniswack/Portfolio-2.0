"use client"

import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

// Lightweight fade transition wrapper using CSS opacity + will-change
export function SmoothPageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const animRef = useRef<number | null>(null)

  useEffect(() => {
    // on path change, fade out then fade in
    setVisible(false)
    if (animRef.current) window.clearTimeout(animRef.current)
    // small stagger to allow outgoing paint
    animRef.current = window.setTimeout(() => setVisible(true), 120)
    return () => { if (animRef.current) window.clearTimeout(animRef.current) }
  }, [pathname])

  return (
    <div className={`smooth-page-transition ${visible ? 'spt-visible' : 'spt-hidden'}`}>
      {children}
    </div>
  )
}
