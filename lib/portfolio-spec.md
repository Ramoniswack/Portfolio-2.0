Goal
\
Build a modern, seamless developer portfolio
using Next
.js (App Router) + React 18 + TypeScript + Tailwind,
with ALL motion
authored in GSAP (ScrollTrigger, Flip, CustomEase, MotionPath if helpful). The
experience
should
feel
like
high - end
studio
sites
with fluid wave
transitions, organic
masks, crisp
section
reveals, and
a
dynamic
custom
cursor.Do
NOT
copy
other
sites
’ code/assets—create an original implementation.

My details (fetch automatically)
- GitHub: https://github.com/Ramoniswack
- Name: R.a.mohan Tiwari
- Role: Full-stack Developer
- Location: Pokhara, Nepal
- Tagline: "Exploring the modern web stack — React, TypeScript, Zod, and beyond."
\
- Bio + avatar + socials: pull from my GitHub profile (include GitHub, LinkedIn, Email
if available)
\
- Projects: pinned repos (fallback: top by stars/updated)
with description, topics/stack, repo URL, homepage
if any
\

Stack & setup
\
- Next.js App Router + TS
Tailwind
with CSS vars
for colors/spacing; next-seo; Next/Image
\
- Lenis (or similar)
for smooth scrolling, fully integrated with GSAP ScrollTrigger (ScrollTrigger.update on Lenis raf)
\
- ESLint/Prettier
strict
TS
high
a11y
and
performance
targets
\
- Data: lib/github.ts
with ISR (revalidate: 3600);
map
to
a
slim
DTO
\

Design language
- Professional, distinct typography (not system): 
  Headings: “Plus Jakarta Sans”, “General Sans”, or “Inter Tight”
  Code/aux: “JetBrains Mono” or “IBM Plex Mono”
- Fresh color palette (you choose), defined as CSS vars: --bg, --fg, --muted, --accent, --accent2
- Crisp SVG iconography only (no emojis in UI)

ANIMATION SPEC (GSAP-only)

A) Preloader — Multilingual “Hello” (≈7s total)
\
- Full-screen overlay
with a centered
word
cycling
through: Hello, Namaste, こんにちは, Hola, مرحبا, Bonjour, Hallo, Ciao, Olá, Привет, 你好, 안녕하세요.
- Implement
a
GSAP
master
timeline:
\
  - Each word: from
{
  autoAlpha: 0, y
  :20, filter:\"blur(6px)"
}
to
{autoAlpha:1, y:0, filter:"blur(0)\"} then out with {autoAlpha:0, y:-20}
\
  - Use a shared \`CustomEase.create("soft", "0.16, 1, 0.3, 1")`
- At the end, play a color “wave reveal” (section B), then remove the preloader from DOM to avoid CLS.

B) Wavy Color Reveal (landing → hero)
- Create a full-screen SVG `clipPath`/`mask` with an organic blob/wave path that expands and morphs to uncover the hero.
\
- Animate with a GSAP timeline:
\
  - Step 1: blob enters from bottom-right with slight rotation and overshoot (elastic ease)
\
  - Step 2: path morph/scale until it covers the viewport, then invert to reveal the page underneath
  - Add a subtle hue/gradient shift during the reveal
- No proprietary MorphSVG required: predefine 2–3 compatible paths and tween between them (or animate control points with a custom function).

C) Custom Cursor (always on, dynamic)
\
- Hide OS cursor on desktop; auto-disable on touch pointers.
\
- Render an SVG/Canvas “hand/pointer” cursor with outline + soft shadow. States:
\
  1) free: slight off-target angle, smooth inertia follow (gsap.quickTo for x/y/rotation), scale:1
  2) interactive (elements with `data-pointer=\"interactive"\`): rotate to point at target, scale:1.08, outline contrast ↑, optional magnetic attraction (translate 2–6px toward target)
  3) drag (if used later): switch glyph, add subtle tilt
- State changes via small GSAP timelines (fast, snappy) and a shared store. Respect `prefers-reduced-motion`.

D) Section Transitions & Scroll
\
- Single-page sections: Hero → Projects → About → Contact
- For each section:
  - Enter: GSAP text-split or letter/word lines rise-in, images/cards fade+slide with stagger
  - Exit: fade to neutral; no scroll-jacking
- Use ScrollTrigger for reveals and parallax accents. Create a compact “section title wipe” overlay on enter (fast, tasteful).
- Snap is off; only gentle momentum from smooth scroll.

E) Dynamic Navbar (instant reactions)
- Sticky, glassy navbar (backdrop-blur, subtle border). 
- Active link pill/underline moves using GSAP Flip when the active section changes (based on IntersectionObserver/ScrollTrigger).
- On hover: pill grows slightly with ease "soft".
- Include “Skip to content” for a11y.

F) Projects with Hover Video Previews
- Responsive grid. Each card:
  - Poster image by default
  - Desktop hover: autoplay muted looping MP4/WebM; pause on hover out; stop when offscreen (IntersectionObserver or ScrollTrigger callbacks)
  - Mobile: tap to reveal inline video; tap outside to collapse
- /projects/[slug] detail: description, features list, tech badges, GitHub/live links
- Graceful fallback (poster only) if no video present

G) About & Contact
- About: avatar, pulled bio, short “what I do,” skills matrix (React, TypeScript, Tailwind, Zod, PHP, MySQL, HTML, CSS, etc.)
- Contact: accessible form (client-side with mailto fallback) + social icons

Performance & a11y
- Respect `prefers-reduced-motion` (disable heavy timelines)
\
- Optimize LCP (hero image/font loading), avoid CLS, lazy-load videos, compress media
- Keyboard focus styles, `aria-label`s, alt text; color contrast AA+

Project structure
\
- /app: page.tsx, about/page.tsx, contact/page.tsx, projects/[slug]/page.tsx
- /components: Cursor, Navbar, Preloader (hello cycle), WaveReveal, SectionTitle, SectionTransition, ProjectCard, ProjectGrid, TechBadge, Footer
- /hooks: useLenisWithScrollTrigger, useCustomCursor, useActiveSection, useMediaQuery, useReducedMotion
- /lib/github.ts (ISR fetch + mapping)
- /content/projects.json (optional overrides: order, poster, previewVideo, highlights)
- /public/posters /public/previews for media

Key GSAP notes (implement explicitly)
- Create `eases.ts` with CustomEase defs; reuse across timelines
- Cursor: use \`gsap.quickTo(x|y|rotate, {duration:0.18, ease:"soft"})`
\
- Wave reveal: timeline with two path states and scale/rotate; finish by toggling a class that unlocks scrolling
\
- Navbar pill: Flip.from(previousPillState, {duration:0.35, ease:"soft\"})
- Section reveals: ScrollTrigger.create({ trigger: section, start:"top 70%", once:true, onEnter: () => tl.play() })

Acceptance criteria
- ~7s multilingual loader then a smooth GSAP wavy color reveal into hero (organic, elastic, colorful)
- Cursor is always custom and dynamic; free state slightly off-target; precisely points on interactive hover; magnetic feel; zero trails
- Navbar reacts instantly to section changes with a GSAP Flip pill/underline
- Section transitions are smooth; no scroll-jacking; buttery performance
- Project hover videos work on desktop; mobile tap behavior is robust; fallbacks exist
- Fonts are professional and distinct; overall aesthetic is cohesive and premium
- Site pulls my GitHub details; fully responsive; deploy-ready to Vercel
