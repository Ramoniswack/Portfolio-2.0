"use client"

import React from 'react'

/**
 * PageTransition (NO-OP)
 * The original implementation attempted a runtime dynamic import of
 * framer-motion which we now avoid. This stub preserves the API and
 * simply renders children directly to disable page transitions.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
