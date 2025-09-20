/**
 * lazyInit
 * Utility to lazy-initialize a callback when an element is near the viewport.
 * Uses IntersectionObserver + requestIdleCallback/requestAnimationFrame fallback.
 */
export function lazyInit(
  el: Element | null,
  cb: () => void,
  options: IntersectionObserverInit = { rootMargin: '200px', threshold: 0 }
) {
  if (!el) return () => {}
  let didInit = false
  const onEnter = () => {
    if (didInit) return
    didInit = true
    if ('requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(() => cb())
    } else {
      // fallback to rAF
      requestAnimationFrame(() => cb())
    }
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) onEnter()
    })
  }, options)
  obs.observe(el)

  return () => {
    obs.disconnect()
  }
}
