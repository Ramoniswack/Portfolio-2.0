"use client"

// Global state to track page preloading
class PagePreloadManager {
  private static instance: PagePreloadManager
  private preloadedPages: Set<string> = new Set()
  private allPagesPreloaded: boolean = false
  private listeners: (() => void)[] = []

  static getInstance(): PagePreloadManager {
    if (!PagePreloadManager.instance) {
      PagePreloadManager.instance = new PagePreloadManager()
    }
    return PagePreloadManager.instance
  }

  markPagePreloaded(url: string) {
    this.preloadedPages.add(url)
    console.log(`📄 Page preloaded: ${url}`)
  }

  markAllPagesPreloaded() {
    this.allPagesPreloaded = true
    console.log(`🎉 All pages preloaded! Navigation should be instant.`)
    this.notifyListeners()
  }

  isPagePreloaded(url: string): boolean {
    return this.allPagesPreloaded && this.preloadedPages.has(url)
  }

  areAllPagesPreloaded(): boolean {
    return this.allPagesPreloaded
  }

  onPreloadComplete(callback: () => void) {
    this.listeners.push(callback)
    // If already preloaded, call immediately
    if (this.allPagesPreloaded) {
      callback()
    }
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback())
  }

  reset() {
    this.preloadedPages.clear()
    this.allPagesPreloaded = false
    this.listeners = []
  }
}

export const pagePreloadManager = PagePreloadManager.getInstance()
