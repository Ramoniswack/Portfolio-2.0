// Simple singleton to ensure only one preview plays at a time
let activeVideo: HTMLVideoElement | null = null

export function setActiveVideo(video: HTMLVideoElement) {
  if (activeVideo && activeVideo !== video) {
    try {
      console.debug('[video-manager] pausing previous active video')
      activeVideo.pause()
      activeVideo.currentTime = 0
    } catch (e) {
      console.error('[video-manager] error pausing previous video', e)
    }
  }
  activeVideo = video
  console.debug('[video-manager] setActiveVideo', { activeVideo })
}

export function clearActiveVideo(video?: HTMLVideoElement) {
  if (!video) {
    console.debug('[video-manager] clearActiveVideo (no arg)')
    activeVideo = null
    return
  }
  if (activeVideo === video) {
    console.debug('[video-manager] clearing active video (matching)')
    activeVideo = null
  }
}

export function pauseActiveVideo() {
  if (activeVideo) {
    try {
      console.debug('[video-manager] pauseActiveVideo')
      activeVideo.pause()
    } catch (e) {
      console.error('[video-manager] error pausing active video', e)
    }
  }
}
