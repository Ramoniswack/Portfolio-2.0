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
  metadataBase: new URL('https://ramohan.com.np'),
  title: {
    default: "R.a.mohan Tiwari - Full-Stack Developer",
    template: "%s | R.a.mohan Tiwari"
  },
  description: "Full-Stack Developer based in Pokhara, Nepal. Crafting web experiences with React, Laravel, Django, and modern tools. Web Development Intern at Xav Technologies. Developer, Writer & Musician.",
  keywords: [
    "R.a.mohan Tiwari",
    "Ramohan Tiwari",
    "Full-Stack Developer", 
    "Web Developer",
    "React Developer",
    "Laravel Developer",
    "Django Developer",
    "TypeScript Developer",
    "PHP Developer",
    "Python Developer",
    "Frontend Developer",
    "Backend Developer",
    "Nepal Developer",
    "Pokhara Developer",
    "Portfolio",
    "Web Development",
    "Software Engineer",
    "WordPress Developer"
  ],
  authors: [{ name: "R.a.mohan Tiwari", url: "https://ramohan.com.np" }],
  creator: "R.a.mohan Tiwari",
  publisher: "R.a.mohan Tiwari",
  category: "Technology",
  robots: {
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
  alternates: {
    canonical: 'https://ramohan.com.np',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ramohan.com.np',
    title: 'R.a.mohan Tiwari - Full-Stack Developer',
    description: 'Full-Stack Developer based in Pokhara, Nepal. Crafting web experiences with React, Laravel, Django, and modern tools.',
    siteName: 'R.a.mohan Tiwari Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'R.a.mohan Tiwari - Full-Stack Developer Portfolio',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'R.a.mohan Tiwari - Full-Stack Developer',
    description: 'Full-Stack Developer based in Pokhara, Nepal. Crafting web experiences with React, Laravel, Django, and modern tools.',
    images: ['/og-image.png'],
    creator: '@ramohan_tiwari',
  },
  icons: {
    icon: [
      { url: '/favicon-circle.png', sizes: 'any', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: [
      { url: '/favicon-circle.png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon-circle.png', color: '#3b82f6' },
    ],
  },
  manifest: '/site.webmanifest',
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
        {/* JSON-LD Structured Data for Rich Search Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Person',
                  '@id': 'https://ramohan.com.np/#person',
                  name: 'R.a.mohan Tiwari',
                  alternateName: 'Ramohan Tiwari',
                  url: 'https://ramohan.com.np',
                  image: 'https://ramohan.com.np/developer-avatar.png',
                  sameAs: [
                    'https://github.com/Ramoniswack',
                    'https://linkedin.com/in/ramon-tiwari',
                  ],
                  jobTitle: 'Full-Stack Developer',
                  worksFor: {
                    '@type': 'Organization',
                    name: 'Xav Technologies',
                  },
                  description: 'Full-Stack Developer based in Pokhara, Nepal. Crafting web experiences with React, Laravel, Django, and modern tools.',
                  knowsAbout: ['React', 'Laravel', 'Django', 'TypeScript', 'PHP', 'Python', 'WordPress', 'PostgreSQL', 'MySQL'],
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Pokhara',
                    addressCountry: 'Nepal',
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://ramohan.com.np/#website',
                  url: 'https://ramohan.com.np',
                  name: 'R.a.mohan Tiwari Portfolio',
                  description: 'Portfolio website of R.a.mohan Tiwari - Full-Stack Developer',
                  publisher: {
                    '@id': 'https://ramohan.com.np/#person',
                  },
                  inLanguage: 'en-US',
                },
                {
                  '@type': 'ProfilePage',
                  '@id': 'https://ramohan.com.np/#profilepage',
                  url: 'https://ramohan.com.np',
                  name: 'R.a.mohan Tiwari - Full-Stack Developer',
                  isPartOf: {
                    '@id': 'https://ramohan.com.np/#website',
                  },
                  about: {
                    '@id': 'https://ramohan.com.np/#person',
                  },
                  mainEntity: {
                    '@id': 'https://ramohan.com.np/#person',
                  },
                },
              ],
            }),
          }}
        />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
        {/* Preload critical cursor assets to avoid flicker/disappearance */}
        <link rel="preload" href="/cursors/cursor-40.png" as="image" type="image/png" />
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
