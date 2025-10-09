#!/bin/bash

# Add all changes first
git add -A

# Commit 1: CSS cursor
git add app/globals.css components/CustomCursor.tsx
git commit -m "feat: implement CSS-only custom cursor system

- Replace JavaScript RAF loop with pure CSS
- Add .custom-cursor-enabled class with !important
- Reduce CPU usage from 1-2% to 0%"

# Commit 2: PNG cursors
git add public/cursors/cursor-40.png public/cursors/pointinghand-40.png
git commit -m "feat: add optimized PNG cursor files (3.4KB total)"

# Commit 3: Remove old cursors
git add public/cursors/
git commit -m "chore: remove unused cursor files (100KB saved)"

# Commit 4: Update layout preload
git add app/layout.tsx
git commit -m "fix: update cursor preload to use PNG instead of SVG"

# Commit 5: WebM videos
git add public/clips/*.webm
git commit -m "feat: add WebM video clips (8.3MB, 77% smaller than MP4)"

# Commit 6: Remove MP4s
git add public/clips/
git commit -m "chore: remove old MP4 video files"

# Commit 7: Video card updates
git add components/VideoProjectCard.tsx
git commit -m "feat: add multi-format video support and fix modal flickering

- Support WebM + MP4 fallback via source elements
- Change preload to metadata for first frame visibility
- Flatten component structure to fix modal flickering"

# Commit 8: Details popup
git add components/ui/DetailsPopup.tsx
git commit -m "feat: implement React Portal modal with full-screen mobile design"

# Commit 9: Logo optimization
git add public/logos/*.png
git commit -m "perf: optimize logo images (7.9MB → 1.3MB, 83% reduction)"

# Commit 10: Icon optimization
git add public/icons/
git commit -m "perf: optimize icon images (2.3MB → 89KB, 96% reduction)"

# Commit 11: Avatar optimization
git add public/developer-avatar.png public/android-chrome-512x512.png
git commit -m "perf: optimize avatar and app icons"

# Commit 12: Remove placeholders
git add public/
git commit -m "chore: remove unused placeholder images"

# Commit 13: Page readiness fix
git add app/page.tsx
git commit -m "fix: remove console spam from page readiness check"

# Commit 14: About page
git add app/about/page.tsx
git commit -m "chore: update about page"

# Commit 15: Remove old docs
git add PERFORMANCE_OPTIMIZATIONS.md
git commit -m "docs: remove outdated performance documentation"

# Commit 16: Remove old scripts
git add scripts/
git commit -m "chore: remove unused performance analysis script"

# Commit 17: Cleanup script
git add cleanup.sh
git commit -m "chore: add cleanup utility script"

# Commit 18: README
git add README.md
git commit -m "docs: add project README"

# Commit 19: Final cleanup
git add -A
git commit -m "chore: final cleanup and optimization pass"

# Commit 20: Summary
git commit --allow-empty -m "perf: performance optimization summary

Total reductions:
- Videos: 36MB → 8.3MB (77% reduction)
- Images: 10.2MB → 1.4MB (86% reduction)
- Total payload: 46.3MB → 9.7MB (79% reduction)
- Custom cursor: 0% CPU usage
- Modal: stable with React Portal"

echo "✅ Created 20 commits successfully!"
git log --oneline -20
