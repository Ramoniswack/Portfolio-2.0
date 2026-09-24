// Simple singleton to ensure only one preview plays at a time
let activeVideo: HTMLVideoElement | null = null

export function setActiveVideo(video: HTMLVideoElement) {
  if (activeVideo && activeVideo !== video) {
    try {

      activeVideo.pause()
      activeVideo.currentTime = 0
    } catch (e) {

    }
  }
  activeVideo = video

}

export function clearActiveVideo(video?: HTMLVideoElement) {
  if (!video) {

    activeVideo = null
    return
  }
  if (activeVideo === video) {

    activeVideo = null
  }
}

export function pauseActiveVideo() {
  if (activeVideo) {
    try {

      activeVideo.pause()
    } catch (e) {

    }
  }
}
