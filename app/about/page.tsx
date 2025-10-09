"use client"

import React, { useRef, useEffect, useState } from "react"
// GSAP/ScrollTrigger removed to disable page transitions/reveals
import Image from "next/image"
import { CustomCursor } from "@/components/CustomCursor"
// EdgeMerge removed for About page to avoid double animations
// SectionWaveTransition removed from this page to avoid background blobs
import { useCompilation } from "@/components/CompilationProvider"
import { downloadResume } from "@/lib/simple-resume-download"
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

interface PortfolioData {
  user: User
  projects: any[]
}

export default function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const { completePageLoad } = useCompilation()

  useEffect(() => {
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
      projects: [],
    })
  }, [])

  useEffect(() => {
    // No page transitions or GSAP reveals for About page — keep it simple
    // and complete the preloader immediately so navigation feels instant.
    const t = setTimeout(() => {
      try { completePageLoad() } catch (e) {}
    }, 50)
    return () => clearTimeout(t)
  }, [completePageLoad])

  return (
    <React.Fragment>
  <CustomCursor />
      <main ref={rootRef} className="min-h-screen px-6 py-24 bg-background text-foreground" data-page="about">
  {/* Hero Section (static, no reveal) */}
  <section className="max-w-4xl mx-auto text-center mb-20 relative overflow-hidden">
    <div className="mb-8">
          {portfolioData?.user.avatar_url && (
            <div style={{ width: 120, height: 120, margin: '0 auto', display: 'grid', placeItems: 'center' }}>
              <Image
                src={portfolioData.user.avatar_url}
                alt={portfolioData.user.name}
                width={120}
                height={120}
                priority
                loading="eager"
                className="rounded-full mb-6 border-4 border-accent/20 shadow-2xl"
              />
            </div>
          )}
        </div>

  <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-foreground">About Me
          {/* About {portfolioData?.user.name || "R.a.mohan Tiwari"} */}
        </h1>
        
  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          {portfolioData?.user.bio || "Full-stack Developer based in Pokhara, Nepal. Exploring the modern web stack - React, TypeScript, Zod, and beyond."}
        </p>

        {/* Social Links */}
  <div className="flex items-center justify-center gap-6 mb-8">
          <a 
            href={portfolioData?.user.html_url || "https://github.com/Ramoniswack"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 transform duration-200"
            title="GitHub Profile"
            data-pointer="interactive"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          
          {portfolioData?.user.blog && (
            <a 
              href={portfolioData.user.blog} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 transform duration-200"
              title="Personal Website"
              data-pointer="interactive"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </a>
          )}
          
          <a 
            href="mailto:ramontiwari086@gmail.com" 
            className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 transform duration-200"
            title="Email Contact"
            data-pointer="interactive"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </a>
        </div>

  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-12">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>📍{" "}
            {portfolioData?.user.location || "Pokhara, Nepal"}
          </span>
          <span>•</span>
          <span>{portfolioData?.user.public_repos || 0} repositories</span>
        </div>
      </section>

      {/* About Content (static wrappers) */}
      <section className="max-w-6xl mx-auto mb-20 relative overflow-hidden">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-foreground">Developer & Creator</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      I love learning new things and enjoy juggling code, ideas, and music. I'm passionate about deep focus and curiosity, 
                      always exploring the intersection of technology and creativity.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-foreground">Writer & Musician</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      I write syntax and lyrics alike. My fingers switch between keyboard and guitar strings, finding rhythm in both 
                      code and music, creating harmony between logic and art.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-8 rounded-2xl">
                <aside>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Quick Facts</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      Self-taught developer
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      Specialized in React & TypeScript
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      UI/UX development focused
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      Music & code enthusiast
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      Based in Pokhara, Nepal
                    </li>
                  </ul>
                </aside>
              </div>
            </div>
          </section>

      {/* Experience Section */}
      <section className="max-w-6xl mx-auto mb-20 relative overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-16 text-foreground">
          Experience
        </h2>
        <div className="space-y-8">
          <div
            className="bg-card border border-border rounded-2xl p-8 hover:border-accent/50 transition-all duration-300 hover:shadow-lg"
            data-pointer="interactive"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">Web Development Intern</h3>
              <span className="text-accent font-medium">April 2025 - May 2025</span>
            </div>
            <p className="text-accent/80 font-medium mb-3">Xav Technologies</p>
            <p className="text-muted-foreground leading-relaxed">
              Focused on React UI development, creating responsive and interactive user interfaces. 
              Gained hands-on experience with modern React patterns, component architecture, and UI/UX best practices 
              while contributing to real-world projects.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section (single unified grid) */}
      <section className="max-w-5xl mx-auto relative overflow-hidden my-12 z-10 px-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-8 text-foreground">Tech Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 items-stretch max-w-5xl mx-auto px-4 pb-8">
          {/** Each card: consistent height, centered circular icon, subtle shadow */}
          {[
            { src: '/icons/react.png', label: 'React' },
            { src: '/icons/Tailwindcss.png', label: 'Tailwind CSS' },
            { src: '/icons/materialui.png', label: 'Material UI' },
            { src: '/icons/shadcnui.png', label: 'shadcn/ui' },
            { src: '/icons/java.png', label: 'Java' },
            { src: '/icons/php.png', label: 'PHP' },
            { src: '/icons/zustand.png', label: 'Zustand' },
            { src: '/icons/zod.png', label: 'Zod' },
            { src: '/icons/mongodb.png', label: 'MongoDB' },
            { src: '/icons/mysql-database.png', label: 'MySQL' },
            { src: '/icons/postgresql.png', label: 'PostgreSQL' },
          ].map((tech, index) => (
            <div key={tech.label} className="flex flex-col items-center justify-center p-4 bg-card/95 border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200" style={{ ['--em-delay' as any]: `${index % 2 === 0 ? 0.018 : 0.026}s` }}>
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-3 shadow-inner">
                <Image src={tech.src} alt={tech.label} width={64} height={64} className="w-9 h-9 object-contain" loading="lazy" quality={85} />
              </div>
              <span className="text-foreground text-sm font-medium">{tech.label}</span>
            </div>
          ))}
          </div>
      </section>

      {/* Social Links Section */}
      <section className="max-w-6xl mx-auto mt-12 mb-16 relative overflow-visible z-10">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-16 text-foreground">
            Connect With Me
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-2xl mx-auto px-4 pb-8 relative z-20">
          <a
            href="https://github.com/Ramoniswack"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-3 sm:p-4 md:p-6 bg-card/95 backdrop-blur-sm border-2 border-border rounded-xl hover:border-accent hover:bg-card transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/25 relative z-30 overflow-visible"
            data-pointer="interactive"
          >
            <div className="mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-foreground group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <span className="text-foreground font-medium text-xs sm:text-sm md:text-sm text-center leading-tight">GitHub</span>
          </a>

          <a
            href="mailto:ramontiwari086@gmail.com"
            className="group flex flex-col items-center p-3 sm:p-4 md:p-6 bg-card/95 backdrop-blur-sm border-2 border-border rounded-xl hover:border-accent hover:bg-card transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/25 relative z-30 overflow-visible"
            data-pointer="interactive"
          >
            <div className="mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-foreground group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <span className="text-foreground font-medium text-xs sm:text-sm md:text-sm text-center leading-tight">Email</span>
          </a>

          <a
            href="https://ramohan.com.np"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-3 sm:p-4 md:p-6 bg-card/95 backdrop-blur-sm border-2 border-border rounded-xl hover:border-accent hover:bg-card transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/25 relative z-30 overflow-visible"
            data-pointer="interactive"
          >
            <div className="mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-foreground group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </div>
            <span className="text-foreground font-medium text-xs sm:text-sm md:text-sm text-center leading-tight">Website</span>
          </a>

          <a
            href="https://linkedin.com/in/ramon-tiwari"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-3 sm:p-4 md:p-6 bg-card/95 backdrop-blur-sm border-2 border-border rounded-xl hover:border-accent hover:bg-card transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/25 relative z-30 overflow-visible"
            data-pointer="interactive"
          >
            <div className="mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-foreground group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <span className="text-foreground font-medium text-xs sm:text-sm md:text-sm text-center leading-tight">LinkedIn</span>
          </a>
          </div>
      </section>

      {/* Download Resume Section */}
      <section className="max-w-6xl mx-auto mb-20 text-center relative overflow-hidden z-5 pt-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-foreground">
            Resume
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Download my complete resume with detailed information about my education, experience, and technical skills.
          </p>
          <div>
            <button
              onClick={downloadResume}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground rounded-full text-lg font-medium transition-all duration-200 hover:scale-102"
              data-pointer="interactive"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </button>
          </div>
      </section>
    </main>
    </React.Fragment>
  )
}

