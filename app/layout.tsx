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
// PageTransitionClient removed — motion folder disabled

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
    // Prefer a single primary favicon (circle) and expose it as the
    // shortcut/ico so browsers pick it for tabs and pinned shortcuts.
    icon: [
      { url: '/favicon-circle.png', sizes: 'any', type: 'image/png' },
    ],
    shortcut: [
      { url: '/favicon-circle.png' },
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
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
        {/* Preload critical cursor assets to avoid flicker/disappearance */}
        <link rel="preload" href="/cursors/cursor.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/cursors/pointinghand.svg" as="image" type="image/svg+xml" />
      </head>
      <body className="antialiased">
        {/* Set a global runtime flag to disable animations for performance/QA */}
        <Script id="disable-animations" strategy="beforeInteractive">
          {`(function(){ try{ window.__DISABLE_ANIMATIONS = true }catch(e){} })()`}
        </Script>
        {/* Initialize performance monitoring in development */}
        {process.env.NODE_ENV === 'development' && (
          <Script id="perf-monitor" strategy="afterInteractive">
            {`
              (function() {
                if (typeof window !== 'undefined') {
                  window.addEventListener('load', function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                      console.log('📊 Page Load: ' + Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms');
                    }
                  });
                }
              })();
            `}
          </Script>
        )}
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
