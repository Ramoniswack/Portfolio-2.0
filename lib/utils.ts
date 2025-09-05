import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function for smooth transitions
export function createTransition(duration: number = 300, easing: string = 'ease-in-out') {
  return `transition-all duration-${duration} ${easing}`
}

// Utility function for responsive breakpoints
export function responsive(mobile: string, tablet?: string, desktop?: string) {
  return [mobile, tablet && `md:${tablet}`, desktop && `lg:${desktop}`]
    .filter(Boolean)
    .join(' ')
}

// Debounce utility for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
