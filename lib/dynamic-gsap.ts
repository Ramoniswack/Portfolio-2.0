// Dynamic GSAP loader to reduce initial bundle size
let gsapInstance: any = null
let ScrollTriggerInstance: any = null
let CustomEaseInstance: any = null

export const loadGSAP = async () => {
  if (gsapInstance) return gsapInstance
  
  const gsapModule = await import('gsap')
  gsapInstance = gsapModule.gsap
  return gsapInstance
}

export const loadScrollTrigger = async () => {
  if (ScrollTriggerInstance) return ScrollTriggerInstance
  
  const [gsap, scrollTriggerModule] = await Promise.all([
    loadGSAP(),
    import('gsap/ScrollTrigger')
  ])
  
  gsap.registerPlugin(scrollTriggerModule.ScrollTrigger)
  ScrollTriggerInstance = scrollTriggerModule.ScrollTrigger
  return ScrollTriggerInstance
}

export const loadCustomEase = async () => {
  if (CustomEaseInstance) return CustomEaseInstance
  
  const [gsap, customEaseModule] = await Promise.all([
    loadGSAP(),
    import('gsap/CustomEase')
  ])
  
  gsap.registerPlugin(customEaseModule.CustomEase)
  CustomEaseInstance = customEaseModule.CustomEase
  return CustomEaseInstance
}

// Preload GSAP on user interaction (not on initial load)
export const preloadGSAP = () => {
  if (typeof window !== 'undefined') {
    const preload = () => {
      loadGSAP()
      loadScrollTrigger()
      loadCustomEase()
    }
    
    // Preload on first user interaction
    const events = ['click', 'scroll', 'keydown', 'touchstart']
    const handler = () => {
      preload()
      events.forEach(event => window.removeEventListener(event, handler))
    }
    
    events.forEach(event => window.addEventListener(event, handler, { once: true }))
  }
}
