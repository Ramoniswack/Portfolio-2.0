"use client"

import React from 'react'

// Minimal stub for legacy JoinSides. This file was retained to avoid
// breaking imports but intentionally avoids runtime-eval or framer-motion.
export default function JoinSides({ children, as: Tag = 'div', className = '' }: any) {
  const Wrapper: any = Tag
  return (
    <Wrapper className={className}>
      {children}
    </Wrapper>
  )
}
