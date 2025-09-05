import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { CustomCursor } from "@/components/CustomCursor"
import { DynamicNavbar } from "@/components/DynamicNavbar"
import { PreloaderProvider } from "@/components/PreloaderProvider"
import { NavigationProvider } from "@/components/NavigationProvider"
import { CompilationProvider } from "@/components/CompilationProvider"
import { GlobalLoadingIndicator } from "@/components/GlobalLoadingIndicator"
import { MediaPreloader } from "@/components/MediaPreloader"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "R.a.mohan Tiwari- a developer",
    template: "%s | R.a.mohan Tiwari"
  },
  description: "Full-Stack Developer & Creator exploring modern web technologies. React, TypeScript, Node.js specialist. Web Development Intern at Xav Technologies. Developer, Writer & Musician.",
  keywords: [
    "R.a.mohan Tiwari",
    "Full-Stack Developer", 
    "Web Developer",
    "React Developer",
    "TypeScript Developer",
    "Frontend Developer",
    "Backend Developer",
    "Nepal Developer",
    "Pokhara Developer",
    "Portfolio",
    "Web Development",
    "Software Engineer"
  ],
  authors: [{ name: "R.a.mohan Tiwari" }],
  creator: "R.a.mohan Tiwari",
  publisher: "R.a.mohan Tiwari",  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ramohan.com.np',
    title: 'R.a.mohan Tiwari- a developer',
    description: 'Full-stack Developer based in Pokhara, Nepal. Crafting exceptional digital experiences with modern web technologies.',
    siteName: 'R.a.mohan Tiwari Portfolio',
    images: [
      {
        url: '/developer-avatar.png',
        width: 1200,
        height: 630,
        alt: 'R.a.mohan Tiwari - Full-Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'R.a.mohan Tiwari- a developer',
    description: 'Full-stack Developer based in Pokhara, Nepal. Crafting exceptional digital experiences with modern web technologies.',
    images: ['/developer-avatar.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-circle.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-circle.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-circle.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicon-circle.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon-circle.png', color: '#3b82f6' },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'google-verification-code-here', // Add your Google verification code
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <MediaPreloader />
        <CompilationProvider>
          <GlobalLoadingIndicator />
          <PreloaderProvider>
            <NavigationProvider>
              <CustomCursor />
              <DynamicNavbar />
              {children}
            </NavigationProvider>
          </PreloaderProvider>
        </CompilationProvider>
      </body>
    </html>
  )
}
