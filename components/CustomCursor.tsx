"use client"

import React, { useEffect } from "react"

// Single, optimized custom cursor implementation
export default function CustomCursor(): null {
  useEffect(() => {
    // HMR / multiple mount guard: attach a global symbol so repeated mounts noop
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const FLAG = '__custom_cursor_singleton_v1'
    if ((window as any)[FLAG]) return
    (window as any)[FLAG] = true

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || prefersReduced) return

    // Create root element
    const root = document.createElement('div')
    root.setAttribute('aria-hidden', 'true')
    root.className = 'app-custom-cursor-root'
    // Minimal layout + GPU only transforms
    Object.assign(root.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      width: '40px',
      height: '40px',
      pointerEvents: 'none',
      // Put the cursor above most UI elements; keep pointer-events none so
      // it doesn't intercept clicks.
      zIndex: '2147483647',
      transform: 'translate3d(-9999px, -9999px, 0)',
      willChange: 'transform, opacity',
      transition: 'opacity 160ms linear',
      opacity: '0',
      contain: 'strict',
      overflow: 'visible',
    } as CSSStyleDeclaration)

    const inner = document.createElement('div')
    inner.className = 'app-custom-cursor-inner'
    Object.assign(inner.style, {
      width: '40px',
      height: '40px',
      backgroundImage: "url('/cursors/cursor.svg')",
      backgroundSize: '40px 40px',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      transform: 'translateZ(0)',
      willChange: 'transform',
    } as CSSStyleDeclaration)

    root.appendChild(inner)
    document.body.appendChild(root)

    // Hide native cursor
    const prevBodyCursor = document.body.style.cursor
    document.body.style.cursor = 'none'

    // State
    let targetX = -9999
    let targetY = -9999
    let x = -9999
    let y = -9999
    let visible = false
    let hoverState: 'default' | 'point' = 'default'

    // Images
    const IMG_DEFAULT = '/cursors/cursor.svg'
    const IMG_POINT = '/cursors/pointinghand.svg'
    let currentImg = IMG_DEFAULT
    inner.style.backgroundImage = `url('${currentImg}')`

    // Interpolation settings: exponential smoothing using dt
    const TELEPORT_DIST = 250
    const TAU = 0.08 // time constant in seconds — lower = snappier

    let rafId: number | null = null
    let lastTime = performance.now()

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!visible) {
        visible = true
        root.style.opacity = '1'
      }
    }

    const onMouseLeave = () => {
      visible = false
      root.style.opacity = '0'
    }

    // Only flip image when the desired state changes
    const setHover = (wantPoint: boolean) => {
      const desired: 'point' | 'default' = wantPoint ? 'point' : 'default'
      if (desired === hoverState) return
      hoverState = desired
      const next = hoverState === 'point' ? IMG_POINT : IMG_DEFAULT
      if (next !== currentImg) {
        currentImg = next
        inner.style.backgroundImage = `url('${currentImg}')`
      }
    }

    const onPointerOver = (e: Event) => {
      const t = e.target as HTMLElement | null
      if (!t) return
      const interactive = Boolean(
        t.closest('[data-pointer="interactive"]') ||
        t.closest('a') ||
        t.closest('button') ||
        t.closest('[role="button"]')
      )
      setHover(interactive)
    }

    // Track focus/blur for keyboard navigation: when focusing interactive elements, show pointer
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null
      if (!t) return
      const interactive = Boolean(
        t.closest('[data-pointer="interactive"]') ||
        t.closest('a') ||
        t.closest('button') ||
        t.closest('[role="button"]')
      )
      // show cursor when focusing interactive via keyboard
      if (interactive) {
        root.style.opacity = '1'
        visible = true
        setHover(true)
      }
    }

    const onFocusOut = () => {
      setHover(false)
    }

    const loop = (now: number) => {
      const dt = Math.max(0, Math.min(32, now - lastTime)) / 1000 // clamp dt (ms -> s)
      lastTime = now

      // If the target is offscreen (initial), just place offscreen
      if (targetX === -9999 && targetY === -9999) {
        x = targetX
        y = targetY
      } else {
        const dx = targetX - x
        const dy = targetY - y
        const dist = Math.hypot(dx, dy)

        // Teleport if too large
        if (dist > TELEPORT_DIST) {
          x = targetX
          y = targetY
        } else {
          // exponential smoothing alpha = 1 - exp(-dt / tau)
          const alpha = 1 - Math.exp(-dt / TAU)
          x += dx * alpha
          y += dy * alpha
        }
      }

      // Round to avoid subpixel garbage that can cause repaints
      const rx = Math.round(x - 20)
      const ry = Math.round(y - 20)
      root.style.transform = `translate3d(${rx}px, ${ry}px, 0)`

      rafId = requestAnimationFrame(loop)
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseover', onPointerOver, { passive: true })
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)

    rafId = requestAnimationFrame(loop)

    // Cleanup
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseover', onPointerOver)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
      try { document.body.removeChild(root) } catch (e) {}
      document.body.style.cursor = prevBodyCursor || ''
      try { delete (window as any)[FLAG] } catch (e) {}
    }
  }, [])

  return null
}

// Provide a named export for backwards compatibility
export { CustomCursor }
