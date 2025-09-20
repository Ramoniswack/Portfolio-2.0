"use client"

import React from 'react'

/**
 * Reveal (NO-OP)
 * Simple wrapper that renders children immediately. IntersectionObserver
 * and framer-motion dependent behavior is intentionally disabled here.
 */
export default function Reveal({ as: Component = 'div', children, className = '', ...props }: any) {
  const Tag = Component as any
  return (
    <Tag className={className} {...props}>
      {children}
    </Tag>
  )
}
