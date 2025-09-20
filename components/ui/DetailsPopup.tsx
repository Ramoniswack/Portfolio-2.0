"use client"

import React from 'react'

type DetailsPopupProps = {
  open: boolean
  onClose: () => void
  title?: string
  children?: React.ReactNode
}

export default function DetailsPopup({ open, onClose, title, children }: DetailsPopupProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-12">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-card max-w-xl w-full sm:max-w-2xl rounded-2xl shadow-xl p-4 sm:p-6 z-50 overflow-auto max-h-[90vh]">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close details" className="text-muted-foreground hover:text-foreground ml-4">✕</button>
        </div>
        <div className="text-muted-foreground text-sm leading-relaxed">{children}</div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-accent text-accent-foreground rounded-md">Close</button>
        </div>
      </div>
    </div>
  )
}
