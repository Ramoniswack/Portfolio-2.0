"use client"

import React from 'react'

// Lightweight programmatic modal: call openVideoModal(src) to show a fullscreen video player
export function openVideoModal(src: string) {
  // Prevent multiple modals
  if (document.getElementById('video-modal-root')) return

  const root = document.createElement('div')
  root.id = 'video-modal-root'
  root.style.position = 'fixed'
  root.style.top = '0'
  root.style.left = '0'
  root.style.width = '100vw'
  root.style.height = '100vh'
  root.style.display = 'flex'
  root.style.alignItems = 'center'
  root.style.justifyContent = 'center'
  root.style.background = 'rgba(0,0,0,0.85)'
  root.style.zIndex = '99999'

  const container = document.createElement('div')
  container.style.width = '90%'
  container.style.maxWidth = '1100px'
  container.style.aspectRatio = '16/9'
  container.style.background = '#000'
  container.style.borderRadius = '12px'
  container.style.overflow = 'hidden'
  container.style.display = 'flex'
  container.style.alignItems = 'center'
  container.style.justifyContent = 'center'

  const video = document.createElement('video')
  video.src = src
  video.controls = true
  video.autoplay = true
  video.muted = false
  video.playsInline = true
  video.style.width = '100%'
  video.style.height = '100%'
  video.style.objectFit = 'cover'

  container.appendChild(video)
  root.appendChild(container)
  document.body.appendChild(root)

  const close = () => {
    try {
      video.pause()
      video.src = ''
    } catch (e) {}
    document.body.removeChild(root)
    document.removeEventListener('keydown', onKey)
  }

  const onClick = (e: MouseEvent) => {
    if (e.target === root) close()
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
  }

  root.addEventListener('click', onClick)
  document.addEventListener('keydown', onKey)
}

export default function VideoModal() {
  return null
}
