
import Link from "next/link"
import { CustomCursor } from "@/components/CustomCursor"
// SectionWaveTransition removed to eliminate background decorations
import { BlogPageClient } from "@/components/BlogPageClient"
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

async function getPosts() {
  const postsDir = path.join(process.cwd(), "app", "blogs", "posts")
  let posts: any[] = []
  
  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir)
    posts = files.filter(f => f.endsWith(".md")).map(filename => {
      const filePath = path.join(postsDir, filename)
      const raw = fs.readFileSync(filePath, "utf8")
      
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
      
      return {
        slug: filename.replace(/\.md$/, ""),
        title: data.title || filename.replace(/\.md$/, "").replace(/-/g, " "),
        excerpt: content.slice(0, 120) + (content.length > 120 ? "..." : ""),
        date: data.date || "",
        category: data.category || "Blog",
        readTime: `${Math.max(1, Math.round(content.split(" ").length / 200))} min read`,
      }
    })
    // Sort by date descending
    posts.sort((a, b) => (a.date < b.date ? 1 : -1))
  }
  
  return posts
}

export default async function BlogsPage() {
  const posts = await getPosts()

  return (
    <>
      <CustomCursor />
      <main className="min-h-screen px-6 py-24 bg-background text-foreground" data-page="blogs">
        <div className="max-w-6xl mx-auto relative overflow-hidden">
          
          {/* Header Section */}
          <header className="text-center mb-20 relative z-10">
            <div className="relative">
              {/* Background decoration removed per request */}
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 mb-8">
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                  <span className="text-accent font-semibold tracking-wider uppercase text-sm">Developer Insights</span>
                  <div className="w-3 h-3 rounded-full bg-accent2"></div>
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text leading-tight">
                  Blog & Stories
                </h1>
                
                <div className="max-w-2xl mx-auto">
                  <div className="h-1 w-32 bg-gradient-to-r from-accent to-accent2 rounded-full mx-auto mb-8"></div>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Exploring the journey of web development, sharing insights from personal experiences, 
                    challenges overcome, and lessons learned along the way.
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Blog Posts Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            {posts.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center">No blog posts found.</p>
            )}
            {posts.map((post, index) => (
              <article 
                key={post.slug} 
                className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                data-pointer="interactive"
              >
                {/* Card Background Effect removed per request */}
                
                <div className="p-8 relative z-10">
                  {/* Meta Information */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span className="text-muted-foreground text-sm font-medium tracking-wide">
                        {post.date && new Date(post.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-muted/10 text-accent border border-accent/10 text-xs font-semibold tracking-wide">
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <Link 
                    href={`/blogs/${post.slug}`}
                    data-pointer="interactive"
                    className="block mb-4 cursor-pointer"
                  >
                    <h2 className="text-2xl font-heading font-bold text-foreground group-hover:text-accent transition-colors duration-300 leading-tight">
                      {post.title}
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                    {post.excerpt}
                  </p>

                  {/* Read More Link */}
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/blogs/${post.slug}`}
                      className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-all duration-200 font-medium group/link cursor-pointer"
                      data-pointer="interactive"
                    >
                      <span>Read Full Story</span>
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center group-hover/link:bg-accent/20 transition-colors duration-200">
                        <svg className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/50"></div>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border border-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </article>
            ))}
          </section>

          {/* Newsletter Section */}
          <section className="rounded-2xl p-8 mt-20 text-center relative overflow-hidden bg-card">
            
            <div className="relative z-10">
              <h3 className="text-2xl font-heading font-bold mb-4 text-foreground">
                More Stories Coming Soon
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                I'm constantly learning and exploring new technologies. 
                Follow my journey as I share more experiences and insights from the world of web development.
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent"></div>
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent"></div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

