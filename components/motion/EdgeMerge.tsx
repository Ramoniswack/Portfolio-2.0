"use client"

import React from 'react'

/**
 * EdgeMerge (NO-OP)
 *
 * Temporarily disabled: this file intentionally no-ops and simply renders
 * its children so importing code does not break. The full animation
 * implementation is removed to disable all motion behavior in the
 * `components/motion` folder per maintainer request.
 */
export type EdgeMergeProps = React.PropsWithChildren<{
  as?: React.ElementType
  className?: string
}>

export default function EdgeMerge({ children, as: Tag = 'div', className = '' }: EdgeMergeProps) {
  const Wrapper: any = Tag
  return (
    <Wrapper className={className}>
      {children}
    </Wrapper>
  )
}
