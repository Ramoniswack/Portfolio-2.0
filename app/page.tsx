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
import { AlternatingProjectCard } from "@/components/AlternatingProjectCard"
import { HoverHint } from "@/components/HoverHint"
import { ExternalLink } from "lucide-react"
import { createScrollAnimation } from "@/lib/scroll-trigger-manager"
import dynamic from 'next/dynamic'
import Reveal from '@/components/motion/Reveal'
// Dynamic client-only wrappers to keep initial bundles small on low-end devices
const Parallax = dynamic(() => import('@/components/ui/Parallax'), { ssr: false })

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
        bio: "Crafting modern web experiences, SaaS platforms, and AI integrations.",
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
          homepage: "https://gadighar.ct.ws/",
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
        
        // Only log once, not in loop
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

                setupScrollAnimations()
                finishChecks()
                return
              }

              // Retry shortly
              setTimeout(tryCall, 150)
            } catch (e) {
              // If sessionStorage isn't available for any reason, proceed.

              setupScrollAnimations()
              finishChecks()
            }
          }

          tryCall()
        }

        const finishChecks = () => {
          // Wait for stability before completing

          setTimeout(() => {
            // Final verification
            const finalCheck = document.querySelector('[data-page="home"]') !== null &&
                              window.location.pathname === '/' &&
                              document.readyState === 'complete'

            if (finalCheck) {

              completePageLoad()
            } else {

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
          
          <Reveal as="div" className="max-w-4xl mx-auto text-center relative z-10">
            <div className="mb-8">
              {portfolioData?.user.avatar_url && (
                <Parallax speed={0.25}>
                  <Image
                    src={portfolioData.user.avatar_url}
                    alt={portfolioData.user.name}
                    width={120}
                    height={120}
                    className="rounded-full mx-auto mb-6 border-4 border-accent/20 shadow-2xl"
                  />
                </Parallax>
              )}
            </div>

            <Reveal as="h1" className="text-5xl md:text-7xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
              {portfolioData?.user.name || "R.a.mohan Tiwari"}
            </Reveal>

            <Reveal as="p" className="text-xl md:text-2xl text-accent font-semibold mb-4">Full-Stack Developer | Co-Founder & CTO @ Everacy</Reveal>

            <Reveal as="p" className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {portfolioData?.user.bio ||
                "Crafting exceptional digital experiences with modern web technologies - React, TypeScript, and beyond."}
            </Reveal>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-12">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>📍{" "}
                {portfolioData?.user.location || "Pokhara, Nepal"}
              </span>
              <span>•</span>
              <span>{portfolioData?.user.public_repos || 0} repositories</span>
            </div>

            <Reveal as="div" className="flex gap-4 justify-center">
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
            </Reveal>
          </Reveal>
        </section>

        {/* Featured Projects Section - Video Grid Layout */}
        <section id="projects" className="py-20 px-6 relative overflow-hidden bg-gradient-to-br from-background via-muted/5 to-accent/5">
          <SectionWaveTransition colorScheme="purple" direction="down" intensity="medium" />
          
          <Reveal as="div" className="max-w-7xl mx-auto relative z-10">
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

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-16 max-w-[1400px] mx-auto w-full">
              <AlternatingProjectCard
                title="Yummyever"
                description="Restaurant POS platform handling IRD-compliant billing, inventory tracking, and QR ordering for 100+ restaurant clients."
                details="Yummyever is a comprehensive restaurant POS platform handling IRD-compliant billing, inventory tracking, and QR ordering for over 100 restaurant clients. It is built to streamline operations and enhance the dining experience."
                topics={["Next.js", "FastAPI", "Flutter", "Cloudinary", "POS"]}
                language="TypeScript"
                stars={0}
                repoUrl="https://github.com/Ramoniswack"
                liveUrl="https://app.yummyever.com"
                logo="/logos/yummymanage_logo.png"
                screenshots={[
                  "/screenshots/yummymanage_dashboard.png",
                  "/screenshots/yummymanage_orders.png",
                  "/screenshots/yummymanage_analytics.png",
                  "/screenshots/yummymanage_menu.png"
                ]}
                poster="/screenshots/Yummy_Manage_Poster.png"
                isReversed={false}
              />

              <AlternatingProjectCard
                title="Teamsever"
                description="Internal team management and workflow tracking platform."
                details="Teamsever is an internal team management and workflow tracking platform designed to optimize productivity and organize team operations efficiently."
                topics={["Next.js", "Node.js", "Express", "MongoDB", "Cloudinary"]}
                language="TypeScript"
                stars={0}
                repoUrl="https://github.com/Ramoniswack"
                liveUrl="https://teamsever.everacy.com"
                logo="/logos/teamsever_logo.png"
                screenshots={[
                  "/screenshots/teamsever_1.png",
                  "/screenshots/teamsever_2.png",
                  "/screenshots/teamsever_3.png",
                  "/screenshots/teamsever_4.png",
                  "/screenshots/teamsever_5.png"
                ]}
                poster="/screenshots/teamsever_poster.png"
                isReversed={true}
              />

              <AlternatingProjectCard
                title="Modyfiles"
                description="Privacy-focused file processing platform offering 85+ PDF, image, audio, and developer utilities."
                details="Modyfiles is a privacy-focused file processing platform offering 85+ utilities. Built with Next.js, FastAPI, and PostgreSQL using client-side processing where possible and automatic server-side file deletion."
                topics={["Next.js", "FastAPI", "PostgreSQL", "Utilities"]}
                language="TypeScript"
                stars={0}
                repoUrl="https://github.com/Ramoniswack"
                liveUrl="https://modyfiles.vercel.app"
                logo="/logos/modyfiles_logo.jpeg"
                screenshots={[
                  "/screenshots/modyfiles_1.png"
                ]}
                poster="/screenshots/modyfiles_poster.png"
                isReversed={true}
              />

              <AlternatingProjectCard
                title="SajiloWork"
                description="A job portal connecting employers and job seekers across Nepal."
                details="SajiloWork is a job portal that seamlessly connects employers and job seekers across Nepal, streamlining the recruitment process for both parties."
                topics={["Next.js", "Django", "Cloudinary", "Job Portal"]}
                language="TypeScript"
                stars={0}
                repoUrl="https://github.com/Ramoniswack"
                liveUrl="https://sajilowork.com"
                logo="/logos/sajilowork_logo.png"
                screenshots={[
                  "/screenshots/sajilowork_1.png",
                  "/screenshots/sajilowork_2.png"
                ]}
                poster="/screenshots/sajilowork_poster.png"
                isReversed={false}
              />

              <AlternatingProjectCard
                title="AttendifyPlus"
                description="An attendance and assignment tracker for schools featuring QR check-ins and role-based dashboards."
                details="AttendifyPlus is a smart, comprehensive platform that manages entire educational institutions—including courses, students, teachers, attendance, and assignments using QR codes. It features real-time analytics, role-based dashboards, and secure device registration."
                topics={["PHP", "MySQL", "QR Code", "Bootstrap"]}
                language="PHP"
                stars={3}
                repoUrl="https://github.com/Ramoniswack/AttendifyPlus"
                liveUrl="https://attendifyplus.ramoniswack.com"
                logo="/logos/attendifyplus_logo.png"
                videoClip="/clips/attendifyplus-clip.mp4"
                poster="/screenshots/attendifyplus_poster.png"
                isReversed={false}
              />
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
          </Reveal>
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

