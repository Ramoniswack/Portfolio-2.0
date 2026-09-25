title: "Why Nobody Clicks Search Results Anymore (And What I'm Doing About It)"
date: "Mar 02, 2026"
category: "AI & Search"

# Why Nobody Clicks Search Results Anymore (And What I'm Doing About It)

A few weeks ago, I caught myself doing something I hadn't done before.

I had a strange Nginx configuration bug where WebSocket connections were dropping randomly after 60 seconds. In the past, my reflex would have been to Google the error, open five different StackOverflow tabs, skim through outdated forum threads from 2017, and piece the solution together myself.

Instead, I opened Perplexity, pasted the error, and had the exact two missing `proxy_read_timeout` directives in about four seconds. I didn't click a single website link.

That was the moment it clicked for me: **the era of traditional SEO is ending, and we need to rethink how we write for the web.**

When people have technical questions, they aren't scanning through ten blue links on Google anymore. They ask ChatGPT, Claude, Perplexity, or read Google's AI Overview. If an AI engine doesn't find your content easy to parse and cite, your website might as well not exist.

Here is what I've learned about Answer Engine Optimization (AEO), and how I changed the way I build web platforms to make sure AI engines actually cite my work.

## The Fluff Era is Dead

For years, SEO "gurus" taught developers to write articles like this:

> *"In today's fast-paced digital world, server administration is a critical component of modern software architecture. Since the dawn of the internet, reverse proxies have played an essential role. In this comprehensive guide, we will explore what Nginx is, why you might want to use it, and eventually answer the question you searched for four paragraphs from now..."*

Everyone hated reading that, but it worked because Google's algorithm rewarded word count and keyword repetition.

AI engines despise this pattern. 

When an AI crawler (like `GPTBot` or `PerplexityBot`) scrapes your page to answer a user's question, it breaks your content into small semantic chunks. If the first two paragraphs under your heading are generic throat-clearing fluff, the relevance score for that chunk drops, and the AI cites another website that got straight to the point.

### The Rule I Follow Now: The 20-Word Answer

Whenever I write a technical explanation or doc page now, I follow one strict rule: **answer the question in the very first sentence directly below the heading.**

For example:
> **How to keep Nginx WebSockets from timing out:**  
> Add `proxy_read_timeout 86400s;` and `proxy_http_version 1.1;` inside your `location` block to prevent Nginx from closing idle WebSocket connections after the default 60-second limit.

After giving the direct answer, you can spend the next five paragraphs explaining *why* it works and the underlying details. Human readers love it because they get what they came for immediately, and AI engines love it because it’s a self-contained, high-confidence snippet ready to be quoted.

## Why Client-Side SPAs Get Ignored

Another big lesson I learned the hard way: heavy client-side JavaScript apps are invisible to many AI crawlers.

While Googlebot has spent millions of dollars optimizing a headless Chromium instance that renders JavaScript before indexing, many AI search bots are designed for speed and cost efficiency. When an AI bot fetches a URL in real-time to answer a user's prompt, it doesn't want to wait 4 seconds for a 2MB React bundle to download, execute, and hydrate client-side state.

If your page returns an empty `<div id="root"></div>` that relies on client-side `useEffect` calls to fetch content, the AI scraper will often time out, see an empty page, and move on.

This is why server-side rendering (SSR) and static generation in Next.js are no longer just performance nice-to-haves—they are mandatory if you want your content indexed by modern answer engines.

## The Secret Weapon: Adding an `llms.txt`

One of the coolest modern standards gaining traction is **`llms.txt`**. 

Think of it like `robots.txt`, but instead of telling bots what *not* to crawl, `llms.txt` gives AI models a clean, token-dense markdown file containing the core documentation and summary of your website.

When an AI engine visits your domain, instead of forcing it to parse through messy navigation headers, cookie banners, and CSS styles, it can simply read `/llms.txt` directly.

Here’s how easy it is to add one in Next.js using a simple route handler:

```typescript
// app/llms.txt/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function GET() {
  const markdown = `# Ramon Tiwari - Full-Stack AI Engineer Portfolio

> Ramon Tiwari is a Full-Stack AI Engineer and Co-Founder/CTO at Everacy, specializing in Next.js, FastAPI, and autonomous AI integrations.

## Core Projects & Products
- [Yummyever](https://app.yummyever.com): Smart POS and QR ordering platform serving 100+ restaurants. Built with Next.js, FastAPI, and Redis Pub/Sub WebSockets.
- [Teamsever](https://teamsever.com): Collaborative workspace management and team coordination tool.
- [Modyfiles](https://modyfiles.com): Secure cloud file management platform.

## Technical Writing
- [Scaling Yummyever to 100+ Restaurants](https://ramontiwari.com/blogs/scaling-yummyever-to-100-restaurants): Deep dive into PostgreSQL schema-per-tenant multi-tenancy and WebSocket architecture.
- [Building Production MCP Servers](https://ramontiwari.com/blogs/building-mcp-servers-for-ai-agents): Practical guide to Anthropic's Model Context Protocol in TypeScript.
`

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
```

It takes 10 minutes to set up, but it makes your site infinitely friendlier to AI agents and search bots.

## Final Thoughts

The web isn't dying; it's just cutting out the middleman. 

We spent two decades writing content stuffed with keywords to please a search engine algorithm, often at the expense of human clarity. The irony of the AI search shift is that the best way to optimize for AI is actually to **write more directly, more concisely, and more honestly for humans**.

Answer the question immediately, cut out the filler, server-render your pages, and let the machines do the rest.
