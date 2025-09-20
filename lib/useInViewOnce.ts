import { useEffect, useRef, useState } from 'react'

/**
 * useInViewOnce
 * Returns [ref, inView] where inView becomes true once the element intersects
 * the viewport (rootMargin configurable). It disconnects after first trigger.
 */
export function useInViewOnce(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (inView) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      })
    }, options)
    obs.observe(el)
    return () => obs.disconnect()
  }, [options, inView])

  return [ref, inView] as const
}
