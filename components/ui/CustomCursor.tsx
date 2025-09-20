"use client";

import { useEffect } from "react";

// Small, instant, 1:1 custom cursor.
// Requirements implemented:
// - Singleton across HMR/route changes via window.__CUSTOM_CURSOR_CREATED
// - Disabled for touch devices and when prefers-reduced-motion is set
// - Uses mousemove only (no requestAnimationFrame) and updates only transform on a single element
// - Rounds coordinates to integers and applies translate3d(x,y,0)
// - Hides native cursor (document.body.style.cursor = 'none') and restores on cleanup
// - Swaps background-image when hovering interactive elements: a, button, [role="button"], [data-pointer="interactive"]

const SIZE = 36; // px, within requested 32-40 range
const DEFAULT_IMG = "/cursors/cursor.svg";
const POINTING_IMG = "/cursors/pointinghand.svg";

export default function CustomCursor(): null {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const anyWin = window as any;

    // Respect reduced motion preference
    try {
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
    } catch (e) {
      // ignore
    }

    // Disable on touch devices
    const isTouch = "ontouchstart" in window || (navigator && (navigator as any).maxTouchPoints > 0);
    if (isTouch) return;

    // Singleton guard (prevents duplicates across HMR / remounts)
    if (anyWin.__CUSTOM_CURSOR_CREATED) return;

    const prevBodyCursor = document.body.style.cursor || "";
    document.body.style.cursor = "none"; // hide native cursor

    const root = document.createElement("div");
    root.setAttribute("data-custom-cursor", "true");
    root.style.position = "fixed";
    root.style.top = "0";
    root.style.left = "0";
    root.style.width = `${SIZE}px`;
    root.style.height = `${SIZE}px`;
    root.style.pointerEvents = "none";
    root.style.zIndex = "2147483647"; // very high
    root.style.transform = `translate3d(-9999px, -9999px, 0)`;
    root.style.willChange = "transform, opacity";
    root.style.opacity = "0";
    // small opacity transition for enter/leave only (movement remains instant)
    root.style.transition = "opacity 120ms linear";

    const img = document.createElement("div");
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.backgroundImage = `url(${DEFAULT_IMG})`;
    img.style.backgroundRepeat = "no-repeat";
    img.style.backgroundPosition = "center";
    img.style.backgroundSize = "contain";
    img.style.pointerEvents = "none";

    root.appendChild(img);
    document.body.appendChild(root);

    anyWin.__CUSTOM_CURSOR_CREATED = true;
    anyWin.__CUSTOM_CURSOR_ELEMENT = root;

    let lastIsInteractive = false;

    const onMouseMove = (e: MouseEvent) => {
      const x = Math.round(e.clientX - SIZE / 2);
      const y = Math.round(e.clientY - SIZE / 2);
      // Instant, 1:1 movement by updating only transform
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      // Ensure visible on pointer movement
      if (root.style.opacity !== "1") root.style.opacity = "1";

      // Swap image only when interactive state changes
      const target = e.target as Element | null;
      const isInteractive = !!(
        target &&
        (target.closest &&
          target.closest("a,button,[role=\"button\"],[data-pointer=\"interactive\"]"))
      );

      if (isInteractive !== lastIsInteractive) {
        lastIsInteractive = isInteractive;
        img.style.backgroundImage = isInteractive ? `url(${POINTING_IMG})` : `url(${DEFAULT_IMG})`;
      }
    };

    const onMouseLeave = () => {
      root.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      if (document.body.contains(root)) document.body.removeChild(root);
      document.body.style.cursor = prevBodyCursor;
      try {
        delete anyWin.__CUSTOM_CURSOR_CREATED;
        delete anyWin.__CUSTOM_CURSOR_ELEMENT;
      } catch (e) {
        anyWin.__CUSTOM_CURSOR_CREATED = undefined;
        anyWin.__CUSTOM_CURSOR_ELEMENT = undefined;
      }
    };
  }, []);

  return null;
}
