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
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-2 sm:p-12" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      {/*
        On small screens render a bottom sheet style: full-width, rounded-top,
        smaller padding, and limited height. On larger screens keep the
        centered dialog with max width.
      */}
      <div className="relative bg-card w-full sm:w-full max-w-md sm:max-w-lg rounded-t-xl sm:rounded-2xl shadow-xl p-3 sm:p-6 z-[100000] overflow-hidden max-h-[80vh]">
        {/* Close button: always visible and reachable */}
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-3 right-3 z-[100001] bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>

        <div className="overflow-auto max-h-[72vh] pr-2">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
          </div>
          <div className="text-muted-foreground text-sm sm:text-base leading-relaxed">{children}</div>
        </div>

        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-accent text-accent-foreground rounded-md">Close</button>
        </div>
      </div>
    </div>
  )
}
