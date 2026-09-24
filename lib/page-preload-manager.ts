"use client"

// Global state to track page and video preloading
class PagePreloadManager {
  private static instance: PagePreloadManager
  private preloadedPages: Set<string> = new Set()
  private preloadedVideos: Set<string> = new Set()
  private allPagesPreloaded: boolean = false
  private allVideosPreloaded: boolean = false
  private listeners: (() => void)[] = []

  static getInstance(): PagePreloadManager {
    if (!PagePreloadManager.instance) {
      PagePreloadManager.instance = new PagePreloadManager()
    }
    return PagePreloadManager.instance
  }

  markPagePreloaded(url: string) {
    this.preloadedPages.add(url)

  }

  markVideoPreloaded(videoSrc: string) {
    this.preloadedVideos.add(videoSrc)

  }

  markAllPagesPreloaded() {
    this.allPagesPreloaded = true

    this.checkAllComplete()
  }

  markAllVideosPreloaded() {
    this.allVideosPreloaded = true

    this.checkAllComplete()
  }

  private checkAllComplete() {
    if (this.allPagesPreloaded && this.allVideosPreloaded) {

      this.notifyListeners()
    }
  }

  isPagePreloaded(url: string): boolean {
    return this.allPagesPreloaded && this.preloadedPages.has(url)
  }

  isVideoPreloaded(videoSrc: string): boolean {
    return this.allVideosPreloaded && this.preloadedVideos.has(videoSrc)
  }

  areAllPagesPreloaded(): boolean {
    return this.allPagesPreloaded
  }

  areAllVideosPreloaded(): boolean {
    return this.allVideosPreloaded
  }

  areAllResourcesPreloaded(): boolean {
    return this.allPagesPreloaded && this.allVideosPreloaded
  }

  onPreloadComplete(callback: () => void) {
    this.listeners.push(callback)
    // If already preloaded, call immediately
    if (this.areAllResourcesPreloaded()) {
      callback()
    }
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback())
  }

  reset() {
    this.preloadedPages.clear()
    this.preloadedVideos.clear()
    this.allPagesPreloaded = false
    this.allVideosPreloaded = false
    this.listeners = []
  }
}

export const pagePreloadManager = PagePreloadManager.getInstance()
