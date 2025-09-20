"use client"

import React from 'react'

/**
 * EdgeMergeClean (NO-OP)
 * Export a minimal wrapper that returns children directly. This disables
 * animations while preserving the component API so imports do not fail.
 */
export default function EdgeMerge({ children, as: Tag = 'div', className = '' }: any) {
  const Wrapper: any = Tag
  return <Wrapper className={className}>{children}</Wrapper>
}
