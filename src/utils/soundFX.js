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

// Global sound effects state (default ON)
let soundEnabled = true
if (typeof window !== 'undefined') {
  soundEnabled = localStorage.getItem('parshva_sound_enabled') !== 'false'
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
const MUSIC_GAIN_BOOST = 2.6
let bgMusic = null
let musicPlaying = false
let userPaused = false
let musicBoostConnected = false
if (typeof window !== 'undefined') {
  userPaused = localStorage.getItem('parshva_music_paused') === 'true'
}
const musicListeners = new Set()

function connectBoostGraph(ctx, audio) {
  if (musicBoostConnected || !ctx || !audio || ctx.state !== 'running') return
  try {
    const source = ctx.createMediaElementSource(audio)
    const gainNode = ctx.createGain()
    gainNode.gain.value = MUSIC_GAIN_BOOST

    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.setValueAtTime(-6, ctx.currentTime)
    compressor.knee.setValueAtTime(6, ctx.currentTime)
    compressor.ratio.setValueAtTime(12, ctx.currentTime)
    compressor.attack.setValueAtTime(0.002, ctx.currentTime)
    compressor.release.setValueAtTime(0.1, ctx.currentTime)

    source.connect(gainNode)
    gainNode.connect(compressor)
    compressor.connect(ctx.destination)
    musicBoostConnected = true
  } catch (e) {
    // Fallback gracefully to native audio.volume = 1.0 if MediaElementSource cannot attach
  }
}

function ensureMusicBoost(audio) {
  if (musicBoostConnected || !audio) return
  const ctx = getAudioContext()
  if (!ctx) return
  if (ctx.state === 'running') {
    connectBoostGraph(ctx, audio)
  } else {
    ctx.resume().then(() => connectBoostGraph(ctx, audio)).catch(() => {})
  }
}

function getMusicAudio() {
  if (typeof window === 'undefined') return null
  if (!bgMusic) {
    const baseUrl = import.meta.env.BASE_URL || '/'
    const cleanBase = baseUrl.replace(/\/$/, '')
    const audioUrl = `${cleanBase}/audio/portfolio-track.mp3`
    bgMusic = new Audio(audioUrl)
    bgMusic.loop = true
    bgMusic.preload = 'auto'
    bgMusic.volume = 1.0

    // Synchronize native audio events with UI state
    bgMusic.addEventListener('play', () => {
      musicPlaying = true
      notifyMusicState()
    })
    bgMusic.addEventListener('pause', () => {
      musicPlaying = false
      notifyMusicState()
    })
    bgMusic.addEventListener('ended', () => {
      if (!userPaused) {
        bgMusic.currentTime = 0
        bgMusic.play().catch(() => {})
      }
    })
  }
  return bgMusic
}

export function isMusicPlaying() {
  return musicPlaying
}

export function subscribeMusicState(callback) {
  musicListeners.add(callback)
  try {
    callback(musicPlaying)
  } catch (e) {}
  return () => musicListeners.delete(callback)
}

function notifyMusicState() {
  const state = musicPlaying
  musicListeners.forEach((fn) => {
    try {
      fn(state)
    } catch (e) {
      console.warn('Music listener error:', e)
    }
  })
}

export function playMusic() {
  userPaused = false
  if (typeof window !== 'undefined') {
    localStorage.setItem('parshva_music_paused', 'false')
  }
  musicPlaying = true
  notifyMusicState()

  const audio = getMusicAudio()
  if (!audio) return Promise.resolve(false)

  audio.muted = false
  audio.volume = 1.0
  ensureMusicBoost(audio)
  const playPromise = audio.play()

  if (playPromise !== undefined) {
    return playPromise
      .then(() => {
        musicPlaying = true
        soundEnabled = true
        ensureMusicBoost(audio)
        notifyMusicState()
        return true
      })
      .catch((err) => {
        console.warn('Audio play restricted by browser policy:', err)
        musicPlaying = false
        notifyMusicState()
        return false
      })
  }
  return Promise.resolve(true)
}

export function pauseMusic() {
  userPaused = true
  if (typeof window !== 'undefined') {
    localStorage.setItem('parshva_music_paused', 'true')
  }
  musicPlaying = false
  const audio = getMusicAudio()
  if (audio) {
    try {
      audio.pause()
    } catch (e) {}
  }
  notifyMusicState()
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

// Global auto-start on page load + seamless fallback on very first user gesture
if (typeof window !== 'undefined') {
  const startAudio = () => {
    if (!userPaused && !isMusicPlaying()) {
      playMusic().catch(() => {})
    }
  }

  // Attempt to play immediately on load
  if (document.readyState === 'complete') {
    startAudio()
  } else {
    window.addEventListener('load', startAudio, { once: true })
  }

  // Ensure playback starts on user interaction if initial autoplay was blocked by browser policy
  const unlockEvents = ['pointerdown', 'keydown', 'touchstart']
  const unlockAudio = (e) => {
    // If the click is on the soundtrack toggle itself, let toggleMusic handle it
    if (e.target && e.target.closest && e.target.closest('button[aria-label*="Soundtrack"]')) {
      return
    }

    if (!userPaused && !isMusicPlaying()) {
      playMusic().then((started) => {
        if (started) {
          unlockEvents.forEach((ev) => window.removeEventListener(ev, unlockAudio))
        }
      }).catch(() => {})
    } else {
      const audio = getMusicAudio()
      if (audio) ensureMusicBoost(audio)
      unlockEvents.forEach((ev) => window.removeEventListener(ev, unlockAudio))
    }
  }

  unlockEvents.forEach((ev) => {
    window.addEventListener(ev, unlockAudio, { passive: true })
  })
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
