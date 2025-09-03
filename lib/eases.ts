export const customEases = {
  soft: "0.16, 1, 0.3, 1",
  elastic: "0.68, -0.55, 0.265, 1.55",
  smooth: "0.25, 0.46, 0.45, 0.94",
  sharp: "0.55, 0.085, 0.68, 0.53",
}

// Register with GSAP when available
export const registerCustomEases = () => {
  if (typeof window !== "undefined" && window.gsap?.CustomEase) {
    window.gsap.CustomEase.create("soft", customEases.soft)
    window.gsap.CustomEase.create("elastic", customEases.elastic)
    window.gsap.CustomEase.create("smooth", customEases.smooth)
    window.gsap.CustomEase.create("sharp", customEases.sharp)
  }
}
