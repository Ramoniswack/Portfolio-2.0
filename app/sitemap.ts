import { MetadataRoute } from 'next'
import fs from 'node:fs'
import path from 'node:path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ramohan.com.np'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]
  
  // Dynamic blog posts
  const postsDir = path.join(process.cwd(), 'app', 'blogs', 'posts')
  let blogPosts: MetadataRoute.Sitemap = []
  
  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir)
    blogPosts = files
      .filter(f => f.endsWith('.md'))
      .map(filename => {
        const slug = filename.replace(/\.md$/, '')
        const filePath = path.join(postsDir, filename)
        const stats = fs.statSync(filePath)
        
        return {
          url: `${baseUrl}/blogs/${slug}`,
          lastModified: stats.mtime,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }
      })
  }
  
  return [...staticPages, ...blogPosts]
}
