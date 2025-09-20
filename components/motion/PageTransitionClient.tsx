"use client"

import React from 'react'
import PageTransition from './PageTransition'

export default function PageTransitionClient({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
