# Performance notes — Motion, sliders, parallax

This document describes the non-invasive motion improvements I added and recommended changes to keep your portfolio buttery-smooth on low-end devices.

Key goals

- Prefer transform/opacity-only animations.
- Lazy-init heavy libraries.
- Respect `prefers-reduced-motion`.
- Keep layout and visual design unchanged while improving motion quality.

What I added

- `components/motion/Reveal.tsx` — a small, client-only reveal wrapper that uses IntersectionObserver + CSS transition. It will try to dynamically import `framer-motion` at runtime if installed and use it; otherwise it falls back to CSS.
- `components/motion/PageTransition.tsx` — optional page transition wrapper using `framer-motion` when installed. It's dynamically imported in `app/layout.tsx` so SSR stays intact; the fallback is a CSS-only wrapper.
- `components/motion/EdgeMerge.tsx` — a CSS-first "join from sides" wrapper that uses IntersectionObserver + transform/opacity transitions, supports optional clip-wipe, stagger, distance and respects `prefers-reduced-motion` (no heavy JS dependency).
- `components/ui/CustomCursor.tsx` — single-instance, RAF-driven cursor that's disabled on touch/reduced-motion and prevents duplicate mounts.

Install notes

- Optional libraries you may want to add when ready:
  - framer-motion: `npm i framer-motion`
  - swiper: `npm i swiper`
  - react-scroll-parallax: `npm i react-scroll-parallax`
    Note: `framer-motion` is optional — the components will gracefully fall back to CSS if it's not installed. Install it only if you want the richer motion variants.

Performance tips

- Use `next/image` with explicit sizes to avoid CLS.
- Lazy-init sliders and parallax with IntersectionObserver (only create instances when the section is near viewport).
- Limit simultaneous animations and use staggered reveals.
- Use `content-visibility: auto` for long offscreen lists when supported.

Toggles & reduced-motion

- The `Reveal` component respects `prefers-reduced-motion` by rendering instantly when the user requests reduced motion.
- For global toggles you can set `window.__DISABLE_ANIMATIONS = true` early in `app/layout.tsx` (this project already uses a guard in parts).

How to use

- Reveal: import and wrap any element:
  - `import Reveal from '@/components/motion/Reveal'`
  - `<Reveal as="section" className="py-12">…</Reveal>`

Next steps (recommended, low risk)

1. Add `components/ui/Slider.tsx` and `components/ui/Parallax.tsx` as dynamic client components.
2. Replace hero/testimonials with `Slider` using dynamic import: `dynamic(() => import('@/components/ui/Slider'), { ssr: false })`.
3. Convert large decorative blobs to conditional components that only render when `window.__DISABLE_ANIMATIONS` is false and when not reduced-motion.

If you want, I can proceed to add `Slider`, `Parallax`, and `utils/lazyInit.ts` next. I will keep changes minimal and add dynamic imports & docs so your low-end machine won't be overloaded.
