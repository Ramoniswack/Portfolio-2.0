"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { downloadResume } from "@/lib/simple-resume-download"

// Define the types locally
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
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)

  useEffect(() => {
    // Set static portfolio data
    setPortfolioData({
      user: {
        name: "R.a.mon Tiwari",
        login: "Ramoniswack",
        avatar_url: "https://avatars.githubusercontent.com/u/131946082?v=4",
        bio: "Exploring the modern web stack — React, TypeScript, Zod, and beyond.",
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

  return (
    <main className="min-h-screen px-6 py-24 bg-background text-foreground">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-20">
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

        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-foreground">
          About Me
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          {portfolioData?.user.bio || "Full-stack Developer based in Pokhara, Nepal. Exploring the modern web stack — React, TypeScript, Zod, and beyond."}
        </p>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <a 
            href={portfolioData?.user.html_url || "https://github.com/Ramoniswack"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 transform duration-200"
            title="GitHub Profile"
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

      {/* About Content */}
      <section className="max-w-6xl mx-auto mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Developer & Creator</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              I love learning new things and enjoy juggling code, ideas, and music. I'm passionate about deep focus and curiosity, 
              always exploring the intersection of technology and creativity.
            </p>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Writer & Musician</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I write — syntax and lyrics alike. My fingers switch between keyboard and guitar strings, finding rhythm in both 
              code and music, creating harmony between logic and art.
            </p>
          </div>
          <div className="bg-gradient-to-br from-accent/10 to-accent2/10 p-8 rounded-2xl">
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
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-16 text-foreground">
          Tech Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {[
            { name: "HTML5", icon: "/icons/html-5.png" },
            { name: "CSS3", icon: "/icons/css-3.png" },
            { name: "JavaScript", icon: "/icons/js.png" },
            { name: "TypeScript", icon: "/icons/typescript.png" },
            { name: "React", icon: "/icons/react.png" },
            { name: "TailwindCSS", icon: "/icons/Tailwindcss.png" },
            { name: "Java", icon: "/icons/java.png" },
            { name: "C++", icon: "/icons/c-.png" },
          ].map((tech, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-card border border-border rounded-xl p-4 hover:border-accent/50 transition-all duration-300 hover:scale-105 hover:shadow-lg group min-h-[100px]"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-3">
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-200"
                  loading="lazy"
                  quality={75}
                />
              </div>
              <span className="text-foreground font-medium text-sm text-center leading-tight">{tech.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Download Resume Section */}
      <section className="max-w-6xl mx-auto mb-20 text-center">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-foreground">
          Resume
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
          Download my complete resume with detailed information about my education, experience, and technical skills.
        </p>
        <button
          onClick={downloadResume}
          className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Resume
        </button>
      </section>
    </main>
  )
}
