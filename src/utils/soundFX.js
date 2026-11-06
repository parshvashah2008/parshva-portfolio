/**
 * Web Audio API Sound Effects & Soundtrack Engine
 * Pure synthesized micro-sounds + seamless looped background soundtrack.
 */

let audioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

// Global sound effects state
let soundEnabled = false
if (typeof window !== 'undefined') {
  soundEnabled = localStorage.getItem('parshva_sound_enabled') === 'true'
}

export function isSoundEnabled() {
  return soundEnabled
}

export function setSoundEnabled(val) {
  soundEnabled = Boolean(val)
  if (typeof window !== 'undefined') {
    localStorage.setItem('parshva_sound_enabled', String(soundEnabled))
  }
  if (soundEnabled) {
    getAudioContext()
    playSyntheticSound('click')
  }
}

export function toggleSound() {
  setSoundEnabled(!soundEnabled)
  return soundEnabled
}

// ----------------------------------------------------
// Soundtrack Audio Player Engine
// ----------------------------------------------------
let bgMusic = null
let musicPlaying = false
let fadeInterval = null
const musicListeners = new Set()

function getMusicAudio() {
  if (typeof window === 'undefined') return null
  if (!bgMusic) {
    const baseUrl = import.meta.env.BASE_URL || '/'
    const cleanBase = baseUrl.replace(/\/$/, '')
    const audioUrl = `${cleanBase}/audio/portfolio-track.mp3`
    bgMusic = new Audio(audioUrl)
    bgMusic.loop = true
    bgMusic.preload = 'auto'
    bgMusic.volume = 0.5
    bgMusic.addEventListener('ended', () => {
      bgMusic.currentTime = 0
      bgMusic.play().catch(() => {})
    })
  }
  return bgMusic
}

export function isMusicPlaying() {
  return musicPlaying
}

export function subscribeMusicState(callback) {
  musicListeners.add(callback)
  return () => musicListeners.delete(callback)
}

function notifyMusicState() {
  musicListeners.forEach((fn) => {
    try {
      fn(musicPlaying)
    } catch (e) {
      console.warn('Music listener error:', e)
    }
  })
}

export function playMusic() {
  const audio = getMusicAudio()
  if (!audio) return Promise.resolve(false)

  if (fadeInterval) {
    clearInterval(fadeInterval)
    fadeInterval = null
  }

  getAudioContext()
  soundEnabled = true

  audio.volume = 0
  const playPromise = audio.play()

  if (playPromise !== undefined) {
    return playPromise
      .then(() => {
        musicPlaying = true
        if (typeof window !== 'undefined') {
          localStorage.setItem('parshva_music_playing', 'true')
          localStorage.setItem('parshva_sound_enabled', 'true')
        }
        notifyMusicState()

        // Smooth volume fade-in
        let vol = 0
        const targetVol = 0.45
        fadeInterval = setInterval(() => {
          vol += 0.05
          if (vol >= targetVol) {
            audio.volume = targetVol
            clearInterval(fadeInterval)
            fadeInterval = null
          } else {
            audio.volume = Math.min(vol, targetVol)
          }
        }, 60)
        return true
      })
      .catch((err) => {
        console.warn('Autoplay prevented or audio playback error:', err)
        musicPlaying = false
        notifyMusicState()
        return false
      })
  }
  return Promise.resolve(false)
}

export function pauseMusic() {
  const audio = getMusicAudio()
  if (!audio) return

  if (fadeInterval) {
    clearInterval(fadeInterval)
    fadeInterval = null
  }

  // Smooth fade-out before pause
  let vol = audio.volume
  fadeInterval = setInterval(() => {
    vol -= 0.08
    if (vol <= 0.02) {
      audio.volume = 0
      audio.pause()
      musicPlaying = false
      clearInterval(fadeInterval)
      fadeInterval = null
      if (typeof window !== 'undefined') {
        localStorage.setItem('parshva_music_playing', 'false')
      }
      notifyMusicState()
    } else {
      audio.volume = Math.max(0, vol)
    }
  }, 40)
}

export function toggleMusic() {
  if (musicPlaying) {
    pauseMusic()
    return false
  } else {
    playMusic()
    return true
  }
}

// Global one-time gesture auto-resume if user previously enabled music
if (typeof window !== 'undefined') {
  const resumeMusicOnGesture = () => {
    if (localStorage.getItem('parshva_music_playing') === 'true' && !musicPlaying) {
      playMusic()
    }
    window.removeEventListener('click', resumeMusicOnGesture)
    window.removeEventListener('keydown', resumeMusicOnGesture)
  }
  window.addEventListener('click', resumeMusicOnGesture, { once: true })
  window.addEventListener('keydown', resumeMusicOnGesture, { once: true })
}

export function playSyntheticSound(type = 'tick') {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime

  if (type === 'tick') {
    // Subtle mechanical hover click (high-frequency ping)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, now)
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.015)
    gain.gain.setValueAtTime(0.04, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.015)
  } else if (type === 'click') {
    // Tactile button click
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.035)
    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.035)
  } else if (type === 'shutter') {
    // Double camera mechanical shutter for photo perspective toggle
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    const gain2 = ctx.createGain()

    osc1.type = 'square'
    osc1.frequency.setValueAtTime(800, now)
    gain1.gain.setValueAtTime(0.05, now)
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.02)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.02)

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(450, now + 0.035)
    gain2.gain.setValueAtTime(0.06, now + 0.035)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.065)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.035)
    osc2.stop(now + 0.065)
  } else if (type === 'open') {
    // Spatial modal opening swell
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.12)
    gain.gain.setValueAtTime(0.06, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.15)
  } else if (type === 'close') {
    // Modal closing drop
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(550, now)
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.09)
    gain.gain.setValueAtTime(0.05, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.1)
  } else if (type === 'keystroke') {
    // Terminal typing tick
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(900 + Math.random() * 200, now)
    gain.gain.setValueAtTime(0.03, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.012)
  }
}
