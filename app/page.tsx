"use client"

import { useEffect, useState, useCallback } from "react"
import { CustomCursor } from "@/components/CustomCursor"
import { SectionWaveTransition } from "@/components/SectionWaveTransition"
import { usePreloader } from "@/components/PreloaderProvider"
import { useCompilation } from "@/components/CompilationProvider"
import { registerCustomEases } from "@/lib/eases"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CustomEase } from "gsap/CustomEase"
import Image from "next/image"
import { VideoProjectCard } from "@/components/VideoProjectCard"
import { HoverHint } from "@/components/HoverHint"
import { ExternalLink } from "lucide-react"
import { createScrollAnimation } from "@/lib/scroll-trigger-manager"

// Define the types locally since we're no longer using GitHub API
interface User {
  name: string
  login: string
  avatar_url: string
  bio: string
  location: string
  blog: string
  html_url: string
  public_repos: number
  followers: number
  following: number
}

interface Project {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  homepage: string
  topics: string[]
  language: string
  stargazers_count: number
  updated_at: string
  pushed_at: string
}

interface PortfolioData {
  user: User
  projects: Project[]
}

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase)
}

export default function HomePage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const { shouldShowPreloader, setPreloaderComplete } = usePreloader()
  const { completePageLoad, isNavigating } = useCompilation()

  // Remove the complex preloader logic - now handled by PreloaderProvider

  useEffect(() => {
    // Register custom eases
    registerCustomEases()

    // Set static portfolio data - updated with correct GitHub information
    setPortfolioData({
      user: {
        name: "R.a.mohan Tiwari",
        login: "Ramoniswack",
        avatar_url: "https://avatars.githubusercontent.com/u/131946082?v=4",
        bio: "Exploring the modern web stack - React, TypeScript, Zod, and beyond.",
        location: "Pokhara, Nepal",
        blog: "https://ramohan.com.np",
        html_url: "https://github.com/Ramoniswack",
        public_repos: 23,
        followers: 3,
        following: 5,
      },
      projects: [
        {
          id: 1,
          name: "Kharcha-Meter",
          full_name: "Ramoniswack/Kharcha-Meter",
          description: "Smart Expense Tracker for Modern Life - Built with React Native, Expo, TypeScript & Supabase for real-time financial management",
          html_url: "https://github.com/Ramoniswack/Kharcha-Meter",
          homepage: "https://kharcha-meter.vercel.app",
          topics: ["react-native", "expo", "typescript", "supabase", "finance", "mobile"],
          language: "TypeScript",
          stargazers_count: 0,
          updated_at: "2024-08-21T00:00:00Z",
          pushed_at: "2024-08-21T00:00:00Z",
        },
        {
          id: 2,
          name: "AttendifyPlus",
          full_name: "Ramoniswack/AttendifyPlus",
          description: "Advanced QR-Based Attendance Management System with PHP, MySQL, and modern UI for educational institutions",
          html_url: "https://github.com/Ramoniswack/AttendifyPlus",
          homepage: "https://attendifyplus.ramoniswack.com",
          topics: ["php", "mysql", "qr-code", "attendance", "education", "bootstrap"],
          language: "PHP",
          stargazers_count: 3,
          updated_at: "2024-08-20T00:00:00Z",
          pushed_at: "2024-08-20T00:00:00Z",
        },
        {
          id: 3,
          name: "GadiGhar",
          full_name: "Ramoniswack/GadiGhar",
          description: "Premium Car Sales Platform for Nepal - Modern automotive marketplace built with React, TypeScript & PHP connecting buyers with quality vehicles",
          html_url: "https://github.com/Ramoniswack/GadiGhar",
          homepage: "https://gadibazaar.infy.uk",
          topics: ["react", "typescript", "php", "marketplace", "automotive", "nepal"],
          language: "TypeScript",
          stargazers_count: 0,
          updated_at: "2024-07-04T00:00:00Z",
          pushed_at: "2024-07-04T00:00:00Z",
        },
        {
          id: 4,
          name: "aaja-ta-suree",
          full_name: "Ramoniswack/aaja-ta-suree",
          description: "Modern To-Do app built with React, TypeScript & Zod - simple, type-safe, responsive. 'Aaja Ta Sure' means 'Today for Sure' in Nepali",
          html_url: "https://github.com/Ramoniswack/aaja-ta-suree",
          homepage: "https://aajatasure.vercel.app",
          topics: ["react", "typescript", "zod", "todo", "authentication", "tailwind"],
          language: "TypeScript",
          stargazers_count: 0,
          updated_at: "2024-06-11T00:00:00Z",
          pushed_at: "2024-06-11T00:00:00Z",
        },
        {
          id: 5,
          name: "MovieFlix",
          full_name: "Ramoniswack/MovieFlix",
          description: "Modern and responsive React application for movie discovery and search. Uses TMDB API with debounced search, loading spinners, and clean UI components",
          html_url: "https://github.com/Ramoniswack/MovieFlix",
          homepage: "https://moviee-flix.vercel.app",
          topics: ["react", "javascript", "tmdb-api", "movies", "search", "responsive"],
          language: "JavaScript",
          stargazers_count: 0,
          updated_at: "2024-06-07T00:00:00Z",
          pushed_at: "2024-06-07T00:00:00Z",
        },
      ],
    })

    if (!shouldShowPreloader) {
      console.log(`🏠 Home page setup triggered`)
      
      // More robust waiting for home page readiness
      const waitForPageReady = () => {
        const isDocumentComplete = document.readyState === 'complete'
        const hasCorrectContent = document.querySelector('[data-page="home"]') !== null
        const hasPortfolioData = portfolioData !== null
        const hasCorrectURL = window.location.pathname === '/'
        
        const isContentReady = isDocumentComplete && 
                             hasCorrectContent && 
                             hasPortfolioData && 
                             hasCorrectURL
        
        console.log(`🔍 Home page readiness:`, {
          isDocumentComplete,
          hasCorrectContent,
          hasPortfolioData,
          hasCorrectURL,
          isContentReady,
          readyState: document.readyState,
          currentURL: window.location.pathname
        })
        
        if (!isContentReady) {
          setTimeout(waitForPageReady, 200)
          return
        }
        
        // Ensure scroll animations are only initialized after the wave reveal
        // has completed. WaveReveal (or other transition) should set
        // sessionStorage.setItem('waveShown', '1') when finished. We poll for
        // that flag for a short timeout and then proceed — this prevents the
        // entrance 'pop' when scroll/entrance tweens run while the wave is
        // still animating.
        const callSetupWhenReady = (maxWait = 3000) => {
          const start = Date.now()

          const tryCall = () => {
            try {
              const waveShown = typeof window !== 'undefined' && sessionStorage.getItem('waveShown') === '1'

              if (waveShown) {
                setupScrollAnimations()
                finishChecks()
                return
              }

              if (Date.now() - start > maxWait) {
                // Give up waiting after timeout — still proceed to avoid
                // leaving the page without animations forever.
                console.log('⏱ wave not detected within timeout — initializing scroll animations')
                setupScrollAnimations()
                finishChecks()
                return
              }

              // Retry shortly
              setTimeout(tryCall, 150)
            } catch (e) {
              // If sessionStorage isn't available for any reason, proceed.
              console.warn('⚠️ Error while checking waveShown, proceeding', e)
              setupScrollAnimations()
              finishChecks()
            }
          }

          tryCall()
        }

        const finishChecks = () => {
          // Wait for stability before completing
          console.log(`⏳ Home page waiting for stability...`)
          setTimeout(() => {
            // Final verification
            const finalCheck = document.querySelector('[data-page="home"]') !== null &&
                              window.location.pathname === '/' &&
                              document.readyState === 'complete'

            if (finalCheck) {
              console.log(`🏁 Home page completing load`)
              completePageLoad()
            } else {
              console.log(`⚠️ Home page final check failed, retrying...`)
              setTimeout(waitForPageReady, 500)
            }
          }, 500)
        }

        // Start polling for the wave-complete flag, or proceed after timeout.
        callSetupWhenReady(3000)
      }
      
      // Start checking after initial delay
      setTimeout(() => {
        waitForPageReady()
      }, 300)
    }

    // Cleanup function to kill all ScrollTriggers and animations
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      gsap.killTweensOf(".animate-on-scroll")
    }
  }, [shouldShowPreloader, completePageLoad, isNavigating])

  const setupScrollAnimations = () => {
    // Use the utility function for safe scroll animations
    gsap.utils.toArray(".animate-on-scroll").forEach((element: any) => {
      createScrollAnimation(
        element,
        {
          from: {
            opacity: 0,
            y: 60,
          },
          to: {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
          }
        },
        isNavigating
      )
    })

    // Wave-like color sweep between sections
    gsap.utils.toArray("section").forEach((section: any, i: number) => {
      const gradientFrom = i % 2 === 0 ? "rgba(99,102,241,0.08)" : "rgba(56,189,248,0.08)"
      const gradientTo = "rgba(0,0,0,0)"
      
      if (!isNavigating) {
        gsap.fromTo(
          section,
          { backgroundImage: `radial-gradient(1200px 200px at 50% 120%, ${gradientFrom}, ${gradientTo})` },
          {
            backgroundImage: `radial-gradient(1200px 200px at 50% -20%, ${gradientFrom}, ${gradientTo})`,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        )
      }
    })
  }

  // Prevent scrolling during loading
  useEffect(() => {
    if (shouldShowPreloader) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [shouldShowPreloader])

  return (
    <>
      {/* Main content - always renders */}

      <main className="min-h-screen" data-page="home">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
          <SectionWaveTransition colorScheme="blue" direction="up" intensity="light" />
          
          <div className="max-w-4xl mx-auto text-center animate-on-scroll relative z-10">
            <div className="mb-8">
              {portfolioData?.user.avatar_url && (
                <Image
                  src={portfolioData.user.avatar_url}
                  alt={portfolioData.user.name}
                  width={120}
                  height={120}
                  className="rounded-full mx-auto mb-6 border-4 border-accent/20 shadow-2xl"
                />
              )}
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
              {portfolioData?.user.name || "R.a.mohan Tiwari"}
            </h1>

            <p className="text-xl md:text-2xl text-accent font-semibold mb-4">a developer</p>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {portfolioData?.user.bio ||
                "Crafting exceptional digital experiences with modern web technologies - React, TypeScript, and beyond."}
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-12">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>📍{" "}
                {portfolioData?.user.location || "Pokhara, Nepal"}
              </span>
              <span>•</span>
              <span>{portfolioData?.user.public_repos || 0} repositories</span>
            </div>

            <div className="flex gap-4 justify-center">
              <a
                href={portfolioData?.user.html_url || "https://github.com/Ramoniswack"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                data-pointer="interactive"
              >
                View GitHub
              </a>
              <a
                href="#projects"
                className="px-8 py-4 border-2 border-accent text-accent rounded-xl font-semibold hover:bg-accent/10 transition-all duration-300 hover:scale-105"
                data-pointer="interactive"
              >
                See Projects
              </a>
            </div>
          </div>
        </section>

        {/* Featured Projects Section - Video Grid Layout */}
        <section id="projects" className="py-20 px-6 relative overflow-hidden bg-gradient-to-br from-background via-muted/5 to-accent/5">
          <SectionWaveTransition colorScheme="purple" direction="down" intensity="medium" />
          
          <div className="max-w-7xl mx-auto animate-on-scroll relative z-10">
              <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground via-accent to-accent2 bg-clip-text text-transparent">
                Featured Projects
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Discover my latest work through interactive previews showcasing modern web technologies and innovative solutions.
              </p>
              {/* Hover hint */}
              <div className="mt-4">
                <HoverHint />
              </div>
            </div>

            {/* Projects Grid - Masonry-style layout like in screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
              
              {/* Row 1 - Desktop projects spanning different widths */}
              <div className="lg:col-span-2">
                <VideoProjectCard
                  title="AttendifyPlus"
                  description="Advanced QR-Based Attendance Management System with PHP, MySQL, and modern UI for educational institutions"
                  topics={["php", "mysql", "qr-code", "attendance", "education", "bootstrap"]}
                  language="PHP"
                  stars={3}
                  repoUrl="https://github.com/Ramoniswack/AttendifyPlus"
                  liveUrl="https://attendifyplus.ramoniswack.com"
                  logo="/logos/attendifyplus.png"
                  videoClip="/clips/attendifyplus-clip.mp4"
                />
              </div>

              <div className="lg:col-span-1">
                <VideoProjectCard
                  title="Kharcha-Meter"
                  description="Smart Expense Tracker for Modern Life - Built with React Native, Expo, TypeScript & Supabase for real-time financial management"
                  topics={["react-native", "expo", "typescript", "supabase", "finance", "mobile"]}
                  language="TypeScript"
                  stars={0}
                  repoUrl="https://github.com/Ramoniswack/Kharcha-Meter"
                  liveUrl="https://kharcha-meter.vercel.app"
                  logo="/logos/KharchaMeterFull.png"
                  videoClip="/clips/Kharchameter-clip.mp4"
                  isMobile={true}
                />
              </div>

              <div className="lg:col-span-1">
                <VideoProjectCard
                  title="aaja-ta-suree"
                  description="Modern To-Do app built with React, TypeScript & Zod - simple, type-safe, responsive. 'Aaja Ta Sure' means 'Today for Sure' in Nepali"
                  topics={["react", "typescript", "zod", "todo", "authentication", "tailwind"]}
                  language="TypeScript"
                  stars={0}
                  repoUrl="https://github.com/Ramoniswack/aaja-ta-suree"
                  liveUrl="https://aajatasure.vercel.app"
                  logo="/logos/aajatasure.png"
                  videoClip="/clips/aajatasure-clip.mp4"
                  isMobile={true}
                />
              </div>

              {/* Row 2 - More desktop projects */}
              <div className="lg:col-span-2">
                <VideoProjectCard
                  title="GadiGhar"
                  description="Premium Car Sales Platform for Nepal - Modern automotive marketplace built with React, TypeScript & PHP connecting buyers with quality vehicles"
                  topics={["react", "typescript", "php", "marketplace", "automotive", "nepal"]}
                  language="TypeScript"
                  stars={0}
                  repoUrl="https://github.com/Ramoniswack/GadiGhar"
                  liveUrl="https://gadibazaar.infy.uk"
                  logo="/logos/Gadighar-square.png"
                  videoClip="/clips/Gadighar-clip.mp4"
                />
              </div>

              <div className="lg:col-span-2">
                <VideoProjectCard
                  title="MovieFlix"
                  description="Modern and responsive React application for movie discovery and search. Uses TMDB API with debounced search, loading spinners, and clean UI components"
                  topics={["react", "javascript", "tmdb-api", "movies", "search", "responsive"]}
                  language="JavaScript"
                  stars={0}
                  repoUrl="https://github.com/Ramoniswack/MovieFlix"
                  liveUrl="https://moviee-flix.vercel.app"
                  logo="/logos/MovieFlix Logo.png"
                  videoClip="/clips/movie-flix-clip.mp4"
                />
              </div>

            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <a
                href="https://github.com/Ramoniswack"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-accent2 text-accent-foreground rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                data-pointer="interactive"
              >
                <span>View All Projects on GitHub</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-card/50 to-accent/5 relative overflow-hidden">
          <SectionWaveTransition colorScheme="emerald" direction="up" intensity="strong" />
          
          <div className="max-w-4xl mx-auto text-center animate-on-scroll relative z-10">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-foreground">Let's Connect</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Interested in collaborating or have a project in mind? I'd love to hear from you and discuss how we can
              work together.
            </p>

            <div className="flex gap-6 justify-center">
              <a
                href="mailto:ramontiwari086@gmail.com"
                className="px-8 py-4 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                data-pointer="interactive"
              >
                Get in Touch
              </a>
              <a
                href={portfolioData?.user.html_url || "https://github.com/Ramoniswack"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-accent text-accent rounded-xl font-semibold hover:bg-accent/10 transition-all duration-300 hover:scale-105"
                data-pointer="interactive"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
