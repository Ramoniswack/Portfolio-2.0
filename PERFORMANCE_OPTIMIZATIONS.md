EdgeMerge (components/motion/EdgeMerge.tsx)

- Client-only, CSS-first "join from sides" wrapper built on IntersectionObserver.
- API: as, from (left|right|up|down), once, delay, stagger, distance, clip, className
- Behavior: sets `data-em="in"` when 25% of the wrapper is visible. Children are animated via transform (translate3d) + opacity. Uses CSS variables for per-child delay and duration. Respects `prefers-reduced-motion` by immediately rendering final state.

Slider lazy-init

- Keep the existing Swiper wrapper but import `swiper/css` inside the client component to avoid shipping styles to server bundles.
- Use IntersectionObserver to initialize Swiper only when the wrapper enters the viewport (lazyInit). Pause autoplay on hover. Disable autoplay when `prefers-reduced-motion`.

Performance guardrails

- Use Next/Image with explicit width/height (or fill + sizes) to avoid CLS.
- Use `content-visibility: auto` on large static sections where possible.
- Avoid animating layout properties; use only transform + opacity.
- Keep motion optional and lightweight; runtime optional framer-motion import removed in favor of CSS-first EdgeMerge.
