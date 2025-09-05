"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Flip } from "gsap/Flip"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePathname, useRouter } from "next/navigation"
import { useNavigation } from "./NavigationProvider"
import { downloadResume } from "@/lib/simple-resume-download"
import { useCompilation } from "./CompilationProvider"

export function DynamicNavbar() {
  const navRef = useRef<HTMLDivElement>(null)
  const cvButtonRef = useRef<HTMLButtonElement>(null)
  const [isVisible] = useState(true)
  const [showCvButton, setShowCvButton] = useState(false)
  const [hasBackground, setHasBackground] = useState(false)
  const [active, setActive] = useState<string>("work")
  const pillRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { navigateWithTransition } = useNavigation()
  const { startPageLoad } = useCompilation()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Flip)
    if (!navRef.current) return

    let ticking = false
    let currentHasBackground = false
    let currentShowCvButton = false

    const updateNavbar = () => {
      const scrollY = window.scrollY

      // Unified logic for all pages: background and CV button together at 50px threshold
      if (scrollY > 50) {
        if (!currentHasBackground) {
          currentHasBackground = true
          setHasBackground(true)
          navRef.current?.classList.add("navbar-solid")
        }
        if (!currentShowCvButton) {
          currentShowCvButton = true
          setShowCvButton(true)
        }
      } else {
        if (currentHasBackground) {
          currentHasBackground = false
          setHasBackground(false)
          navRef.current?.classList.remove("navbar-solid")
        }
        if (currentShowCvButton) {
          currentShowCvButton = false
          setShowCvButton(false)
        }
      }

      ticking = false
    }

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar)
        ticking = true
      }
    }

    window.addEventListener("scroll", requestTick)
    // Initial check
    updateNavbar()

    return () => {
      window.removeEventListener("scroll", requestTick)
    }
  }, [pathname])

  // Active pill movement with GSAP Flip on route/section change
  useEffect(() => {
    if (!listRef.current || !pillRef.current) return
    const links = Array.from(listRef.current.querySelectorAll<HTMLAnchorElement>("a[data-nav]"))
    const setPill = () => {
      const current = links.find((l) => l.dataset.nav === active)
      if (!current || !pillRef.current) return
      const state = Flip.getState(pillRef.current)
      const rect = current.getBoundingClientRect()
      const parentRect = listRef.current!.getBoundingClientRect()
      Object.assign(pillRef.current.style, {
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        transform: `translate(${rect.left - parentRect.left}px, ${rect.top - parentRect.top}px)`,
      })
      Flip.from(state, { duration: 0.35, ease: "power2.out" })
    }
    setTimeout(setPill, 0)
    window.addEventListener("resize", setPill)
    return () => window.removeEventListener("resize", setPill)
  }, [active])

  // Sync active state with pathname and reset states
  useEffect(() => {
    if (pathname?.startsWith("/about")) {
      setActive("about")
    } else if (pathname?.startsWith("/blogs")) {
      setActive("blogs") 
    } else {
      setActive("work")
    }
    
    // Reset states on route change
    setHasBackground(false)
    setShowCvButton(false)
    if (navRef.current) {
      navRef.current.classList.remove("navbar-solid")
    }
  }, [pathname])

  const handleNavClick = (section: string, href: string) => {
    setActive(section)
    
    // Set the page name and start loading immediately when clicked
    const pageNames: Record<string, string> = {
      work: 'Work',
      about: 'About', 
      blogs: 'Blog'
    }
    
    // Start loading indicator immediately with correct page name
    startPageLoad(pageNames[section] || 'Work')
    
    // Map sections to color schemes
    const colorSchemes: Record<string, string> = {
      work: 'blue',
      about: 'purple', 
      blogs: 'emerald'
    }
    
    const colorScheme = colorSchemes[section] || 'blue'
    
    // Use wave transition for navigation
    navigateWithTransition(href, colorScheme)
  }

  return (
    <>
      <nav ref={navRef} className="navbar">
        {/* Unified Navigation for Both Desktop and Mobile */}
        <div className="flex items-center justify-between w-full">
          {/* Logo/Brand - Only on Mobile */}
          <div className="flex md:hidden">
            <span className={`font-semibold text-lg transition-colors duration-200 ${
              hasBackground ? "text-white" : "text-slate-900"
            }`}>R.a.mohan</span>
          </div>

          {/* Navigation Links - Always Visible */}
          <div className="flex items-center justify-center flex-1 md:justify-start">
            <div ref={listRef} className="relative flex items-center gap-2 lg:gap-6">
              <div ref={pillRef} className="absolute rounded-full bg-white/10 border border-white/15 backdrop-blur pointer-events-none navbar-pill-initial" />
              <a 
                data-nav="work" 
                href="/" 
                onClick={(e) => { e.preventDefault(); handleNavClick("work", "/") }} 
                className={`relative px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  active === "work" 
                    ? hasBackground ? "text-white" : "text-slate-900" 
                    : hasBackground ? "text-slate-200" : "text-slate-700"
                }`} 
                data-pointer="interactive"
              >
                Work
              </a>
              <a 
                data-nav="about" 
                href="/about" 
                onClick={(e) => { e.preventDefault(); handleNavClick("about", "/about") }} 
                className={`relative px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  active === "about" 
                    ? hasBackground ? "text-white" : "text-slate-900" 
                    : hasBackground ? "text-slate-200" : "text-slate-700"
                }`} 
                data-pointer="interactive"
              >
                About
              </a>
              <a 
                data-nav="blogs" 
                href="/blogs" 
                onClick={(e) => { e.preventDefault(); handleNavClick("blogs", "/blogs") }} 
                className={`relative px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  active === "blogs" 
                    ? hasBackground ? "text-white" : "text-slate-900" 
                    : hasBackground ? "text-slate-200" : "text-slate-700"
                }`} 
                data-pointer="interactive"
              >
                Blog
              </a>
            </div>
          </div>

          {/* CV Button - Always on Right */}
          {showCvButton && (
            <div className="flex">
              <button
                ref={cvButtonRef}
                className="px-3 py-1.5 md:px-4 lg:px-6 md:py-2 lg:py-2.5 bg-accent text-accent-foreground rounded-full text-xs lg:text-sm font-medium hover:bg-accent/90 transition-all duration-300 hover:scale-105 shadow-lg"
                data-pointer="interactive"
                onClick={downloadResume}
              >
                <span className="hidden lg:inline">Download CV</span>
                <span className="lg:hidden">CV</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
