"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export interface CursorState {
  x: number
  y: number
  scale: number
  rotation: number
  isHovering: boolean
}

export function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const cursorStateRef = useRef<CursorState>({
    x: 0,
    y: 0,
    scale: 1,
    rotation: -15,
    isHovering: false,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const cursor = cursorRef.current
    const ring = ringRef.current
    if (!cursor || !ring) return

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    // Only render on desktop-like pointers
    const supportsHover = window.matchMedia("(hover: hover)").matches
    const finePointer = window.matchMedia("(pointer: fine)").matches
    if (!supportsHover || !finePointer) return

    document.body.classList.add("cursor-hidden")
    cursor.style.opacity = "1"
    ring.style.opacity = "1"

    // GSAP quickTo for smooth cursor movement
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.18, ease: "power2.out" })
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.18, ease: "power2.out" })
    const rotateTo = gsap.quickTo(cursor, "rotate", { duration: 0.25, ease: "power2.out" })
    const scaleTo = gsap.quickTo(cursor, "scale", { duration: 0.2, ease: "power2.out" })
    const ringXTo = gsap.quickTo(ring, "x", { duration: 0.32, ease: "power3.out" })
    const ringYTo = gsap.quickTo(ring, "y", { duration: 0.32, ease: "power3.out" })
    const ringScaleTo = gsap.quickTo(ring, "scale", { duration: 0.25, ease: "power3.out" })

    // Mouse move handler
    let lastX = 0
    let lastY = 0
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      cursorStateRef.current.x = clientX
      cursorStateRef.current.y = clientY

      xTo(clientX)
      yTo(clientY)
      ringXTo(clientX)
      ringYTo(clientY)

      const dx = clientX - lastX
      const dy = clientY - lastY
      lastX = clientX
      lastY = clientY
      const angle = Math.atan2(dy, dx) * (180 / Math.PI)
      rotateTo(angle / 3 - 15)
    }

    // Handle interactive elements
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.hasAttribute("data-pointer") && target.getAttribute("data-pointer") === "interactive") {
        cursorStateRef.current.isHovering = true
        cursorStateRef.current.rotation = 0
        cursorStateRef.current.scale = 1.2

        rotateTo(0)
        scaleTo(1.2)
        ringScaleTo(1.5)

        const dot = cursor.querySelector(".cursor-dot") as HTMLElement | null
        const pointer = cursor.querySelector(".cursor-pointer") as HTMLElement | null
        const click = cursor.querySelector(".cursor-click") as HTMLElement | null
        
        if (dot) dot.style.opacity = "0"
        if (pointer) pointer.style.opacity = "1"
        if (click) click.style.opacity = "0"
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.hasAttribute("data-pointer") && target.getAttribute("data-pointer") === "interactive") {
        cursorStateRef.current.isHovering = false
        cursorStateRef.current.rotation = -15
        cursorStateRef.current.scale = 1

        rotateTo(-15)
        scaleTo(1)
        ringScaleTo(1)
        
        const dot = cursor.querySelector(".cursor-dot") as HTMLElement | null
        const pointer = cursor.querySelector(".cursor-pointer") as HTMLElement | null
        const click = cursor.querySelector(".cursor-click") as HTMLElement | null
        
        if (dot) dot.style.opacity = "1"
        if (pointer) pointer.style.opacity = "0"
        if (click) click.style.opacity = "0"
      }
    }

    const handleMouseDown = () => {
      scaleTo(0.9)
      ringScaleTo(0.8)
      
      const dot = cursor.querySelector(".cursor-dot") as HTMLElement | null
      const pointer = cursor.querySelector(".cursor-pointer") as HTMLElement | null
      const click = cursor.querySelector(".cursor-click") as HTMLElement | null
      
      if (cursorStateRef.current.isHovering) {
        if (pointer) pointer.style.opacity = "0"
        if (click) click.style.opacity = "1"
      }
      
      gsap.to(ring, { borderColor: "rgba(59,130,246,0.6)", duration: 0.15 })
    }

    const handleMouseUp = () => {
      scaleTo(cursorStateRef.current.isHovering ? 1.2 : 1)
      ringScaleTo(cursorStateRef.current.isHovering ? 1.5 : 1)
      
      const pointer = cursor.querySelector(".cursor-pointer") as HTMLElement | null
      const click = cursor.querySelector(".cursor-click") as HTMLElement | null
      
      if (cursorStateRef.current.isHovering) {
        if (pointer) pointer.style.opacity = "1"
        if (click) click.style.opacity = "0"
      }
      
      gsap.to(ring, { borderColor: "rgba(148,163,184,0.35)", duration: 0.2 })
    }

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseenter", handleMouseEnter, true)
    document.addEventListener("mouseleave", handleMouseLeave, true)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter, true)
      document.removeEventListener("mouseleave", handleMouseLeave, true)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.classList.remove("cursor-hidden")
    }
  }, [])

  return { cursorRef, ringRef }
}
