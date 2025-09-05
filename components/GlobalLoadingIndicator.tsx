"use client"

import { useCompilation } from "./CompilationProvider"
import { CompilationLoader } from "./CompilationLoader"

export function GlobalLoadingIndicator() {
  const { isPageLoading, currentPageName } = useCompilation()

  return (
    <CompilationLoader 
      isVisible={isPageLoading} 
      message={`Loading ${currentPageName}...`} 
    />
  )
}
