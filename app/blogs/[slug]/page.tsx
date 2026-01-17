
import type { Metadata } from "next"
import fs from "node:fs"
import path from "node:path"
import React from "react"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import { CustomCursor } from "@/components/CustomCursor"
import { ShareButtons } from "@/components/ShareButtons"

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "app", "blogs", "posts")
  if (!fs.existsSync(postsDir)) return []
  const files = fs.readdirSync(postsDir)
  return files.filter(f => f.endsWith(".md")).map(filename => ({ 
    slug: filename.replace(/\.md$/, "") 
  }))
}

// Helper function to parse frontmatter
function parseFrontmatter(raw: string) {
  const lines = raw.split('\n')
  const frontmatterEnd = lines.findIndex(line => line.trim().startsWith('#'))
  
  let data: any = {}
  let content = raw
  
  if (frontmatterEnd > 0) {
    const frontmatterLines = lines.slice(0, frontmatterEnd)
    content = lines.slice(frontmatterEnd).join('\n')
    
    frontmatterLines.forEach(line => {
      const match = line.match(/^(\w+):\s*"?([^"]+)"?$/)
      if (match) {
        data[match[1]] = match[2].replace(/"/g, '')
      }
    })
  }
  
  return { data, content }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const file = path.join(process.cwd(), "app", "blogs", "posts", `${slug}.md`)
  
  if (!fs.existsSync(file)) {
    return { title: "Blog Post Not Found" }
  }
  
  const raw = fs.readFileSync(file, "utf8")
  const { data, content } = parseFrontmatter(raw)
  
  const title = data.title || slug.replace(/-/g, ' ')
  const description = content.slice(0, 160).replace(/[#*`]/g, '').trim() + '...'
  
  return {
    title: title,
    description: description,
    openGraph: {
      title: `${title} | R.a.mohan Tiwari`,
      description: description,
      type: 'article',
      publishedTime: data.date,
      authors: ['R.a.mohan Tiwari'],
      tags: [data.category || 'Web Development'],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    },
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const file = path.join(process.cwd(), "app", "blogs", "posts", `${slug}.md`)
  
  let htmlContent = "<p>Coming soon.</p>"
  let frontmatter: any = {}
  
  if (fs.existsSync(file)) {
    const raw = await fs.promises.readFile(file, "utf8")
    
    // Parse frontmatter without --- delimiters
    const lines = raw.split('\n')
    const frontmatterEnd = lines.findIndex(line => line.trim().startsWith('#'))
    
    let data: any = {}
    let content = raw
    
    if (frontmatterEnd > 0) {
      const frontmatterLines = lines.slice(0, frontmatterEnd)
      content = lines.slice(frontmatterEnd).join('\n')
      
      // Parse simple key: value format
      frontmatterLines.forEach(line => {
        const match = line.match(/^(\w+):\s*"?([^"]+)"?$/)
        if (match) {
          data[match[1]] = match[2].replace(/"/g, '')
        }
      })
    }
    
    frontmatter = data
    const processed = await remark().use(html).process(content)
    htmlContent = processed.toString()
  }
  
  return (
    <>
      <CustomCursor />
      <main className="min-h-screen px-6 py-24 bg-background text-foreground">
        <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-16 text-center relative">
          {/* Background decoration removed per request */}
          
          {/* Meta info */}
          <div className="flex items-center justify-center gap-6 mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span className="text-muted-foreground text-sm font-medium tracking-wide">
                {frontmatter.date && new Date(frontmatter.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30"></div>
            <div className="relative">
              <span className="px-4 py-2 rounded-full bg-muted/10 text-accent border border-accent/10 text-sm font-semibold tracking-wide">
                {frontmatter.category || "Blog"}
              </span>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-8 text-foreground leading-tight relative z-10 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
            {frontmatter.title || "Blog Post"}
          </h1>
          
          {/* Subtitle/Description */}
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="h-1 w-24 bg-gradient-to-r from-accent to-accent2 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A personal journey through web development challenges and discoveries
            </p>
          </div>
        </header>

        {/* Article Content */}
        <article 
          className="prose prose-lg prose-invert max-w-none
            [&>h1:first-of-type]:hidden
            prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground
            prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-16 prose-h1:text-center
            prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:text-foreground prose-h2:scroll-mt-24 prose-h2:pb-4 prose-h2:border-b prose-h2:border-border/50
            prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-foreground/90
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
            prose-strong:text-foreground prose-strong:font-semibold
            prose-code:bg-accent/10 prose-code:text-accent prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:my-6
            [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-muted-foreground [&_pre_code]:text-sm
            prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground/80 prose-blockquote:bg-accent/5 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:my-8
            prose-ul:text-muted-foreground prose-ul:my-6 prose-ul:space-y-3
            prose-ol:text-muted-foreground prose-ol:my-6 prose-ol:space-y-3
            prose-li:text-lg prose-li:leading-relaxed [&_li]:marker:text-accent
            prose-a:text-accent prose-a:decoration-accent/30 hover:prose-a:decoration-accent prose-a:transition-all prose-a:duration-200
            prose-hr:border-border prose-hr:my-12
            [&_p:first-of-type]:text-xl [&_p:first-of-type]:font-medium [&_p:first-of-type]:text-foreground/90 [&_p:first-of-type]:leading-relaxed
          "
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />

        {/* Navigation */}
        <footer className="mt-20 pt-12 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <a 
              href="/blogs" 
              className="inline-flex items-center gap-3 text-accent hover:text-accent/80 transition-all duration-200 font-medium group cursor-pointer"
              data-pointer="interactive"
            >
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              Back to Blog
            </a>
            
            <div className="flex items-center gap-6">
              <span className="text-sm text-muted-foreground font-medium">Share this post:</span>
              <ShareButtons 
                title={frontmatter.title || 'Blog Post'} 
                url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/blogs/${slug}`} 
              />
            </div>
          </div>
        </footer>
      </div>
    </main>
    </>
  )
}

