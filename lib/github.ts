export interface GitHubUser {
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

export interface GitHubRepo {
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

export interface PortfolioData {
  user: GitHubUser
  projects: GitHubRepo[]
}

const GITHUB_USERNAME = "Ramoniswack"
const GITHUB_API_BASE = "https://api.github.com"

export async function fetchGitHubData(): Promise<PortfolioData> {
  try {
    // Add timeout and better headers for GitHub API
    const fetchWithTimeout = async (url: string, timeout = 5000) => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-Website',
          },
          next: { revalidate: 3600 },
        })
        clearTimeout(timeoutId)
        return response
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    }

    // Fetch user data
    const userResponse = await fetchWithTimeout(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`)

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user data: ${userResponse.status}`)
    }

    const user: GitHubUser = await userResponse.json()

    // Fetch repositories
    const reposResponse = await fetchWithTimeout(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`)

    if (!reposResponse.ok) {
      throw new Error(`Failed to fetch repositories: ${reposResponse.status}`)
    }

    const allRepos: GitHubRepo[] = await reposResponse.json()

    // Filter and sort projects (pinned repos or top by stars/updated)
    const projects = allRepos
      .filter((repo) => !repo.name.includes(".github.io") && repo.description) // Filter out GitHub Pages and repos without descriptions
      .sort((a, b) => {
        // Sort by stars first, then by updated date
        if (a.stargazers_count !== b.stargazers_count) {
          return b.stargazers_count - a.stargazers_count
        }
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      })
      .slice(0, 6) // Take top 6 projects

    return { user, projects }
  } catch (error) {
    console.error("Error fetching GitHub data:", error)

    // Enhanced fallback data with real projects
    return {
      user: {
        name: "R.a.mon Tiwari",
        login: "Ramoniswack",
        avatar_url: "/developer-avatar.png",
        bio: "Exploring the modern web stack — React, TypeScript, Zod, and beyond.",
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
          name: "AttendifyPlus",
          full_name: "Ramoniswack/AttendifyPlus",
          description: "Advanced QR-Based Attendance Management System with PHP, MySQL, and modern UI for educational institutions",
          html_url: "https://github.com/Ramoniswack/AttendifyPlus",
          homepage: "https://attendifyplus.vercel.app",
          topics: ["php", "mysql", "qr-code", "attendance", "education", "bootstrap"],
          language: "PHP",
          stargazers_count: 3,
          updated_at: "2024-08-21T00:00:00Z",
          pushed_at: "2024-08-21T00:00:00Z",
        },
        {
          id: 2,
          name: "Kharcha-Meter",
          full_name: "Ramoniswack/Kharcha-Meter",
          description: "Smart Expense Tracker built with React Native, Expo, TypeScript, and Supabase for modern financial management",
          html_url: "https://github.com/Ramoniswack/Kharcha-Meter",
          homepage: "https://kharcha-meter.vercel.app",
          topics: ["react-native", "expo", "typescript", "supabase", "finance", "mobile"],
          language: "TypeScript",
          stargazers_count: 8,
          updated_at: "2024-08-20T00:00:00Z",
          pushed_at: "2024-08-20T00:00:00Z",
        },
        {
          id: 3,
          name: "Gadighar",
          full_name: "Ramoniswack/Gadighar",
          description: "Modern web application for digital vehicle marketplace with advanced search and filtering capabilities",
          html_url: "https://github.com/Ramoniswack/Gadighar",
          homepage: "https://gadighar.vercel.app",
          topics: ["nextjs", "typescript", "marketplace", "vehicles", "web-app"],
          language: "TypeScript",
          stargazers_count: 5,
          updated_at: "2024-08-15T00:00:00Z",
          pushed_at: "2024-08-15T00:00:00Z",
        },
        {
          id: 4,
          name: "aaja-ta-sure",
          full_name: "Ramoniswack/aaja-ta-sure",
          description: "Event planning and management platform with real-time collaboration features",
          html_url: "https://github.com/Ramoniswack/aaja-ta-sure",
          homepage: "https://aaja-ta-sure.vercel.app",
          topics: ["react", "nodejs", "events", "collaboration", "planning"],
          language: "JavaScript",
          stargazers_count: 4,
          updated_at: "2024-08-10T00:00:00Z",
          pushed_at: "2024-08-10T00:00:00Z",
        },
        {
          id: 5,
          name: "movieflix",
          full_name: "Ramoniswack/movieflix",
          description: "Netflix-inspired movie streaming platform with responsive design and modern UI components",
          html_url: "https://github.com/Ramoniswack/movieflix",
          homepage: "https://movieflix-ramon.vercel.app",
          topics: ["react", "movie-app", "streaming", "responsive", "entertainment"],
          language: "JavaScript",
          stargazers_count: 6,
          updated_at: "2024-08-05T00:00:00Z",
          pushed_at: "2024-08-05T00:00:00Z",
        },
        {
          id: 6,
          name: "v0-portfolio",
          full_name: "Ramoniswack/v0-portfolio",
          description: "Modern portfolio website built with Next.js, TypeScript, and GSAP animations featuring dynamic content",
          html_url: "https://github.com/Ramoniswack/v0-portfolio",
          homepage: "https://ramon-portfolio.vercel.app",
          topics: ["nextjs", "typescript", "gsap", "tailwindcss", "portfolio", "animations"],
          language: "TypeScript",
          stargazers_count: 2,
          updated_at: "2024-08-21T00:00:00Z",
          pushed_at: "2024-08-21T00:00:00Z",
        },
      ],
    }
  }
}
