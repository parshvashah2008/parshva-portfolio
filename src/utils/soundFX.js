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
let bgMusic = null
let musicPlaying = false
let fadeInterval = null
const musicListeners = new Set()

// Per user instruction: soundtrack must ALWAYS play on launch, never start paused
let musicWanted = true
if (typeof window !== 'undefined') {
  localStorage.removeItem('parshva_music_playing')
  sessionStorage.removeItem('parshva_soundtrack_paused')
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
    bgMusic.volume = 0.45
    bgMusic.addEventListener('ended', () => {
      bgMusic.currentTime = 0
      bgMusic.play().catch(() => {})
    })
  }
  return bgMusic
}

export function isMusicPlaying() {
  return musicPlaying || musicWanted
}

export function subscribeMusicState(callback) {
  musicListeners.add(callback)
  try {
    callback(isMusicPlaying())
  } catch (e) {}
  return () => musicListeners.delete(callback)
}

function notifyMusicState() {
  const state = isMusicPlaying()
  musicListeners.forEach((fn) => {
    try {
      fn(state)
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

  musicWanted = true
  notifyMusicState()

  const targetVol = 0.45
  if (musicPlaying && audio.volume > 0.3 && !audio.paused) {
    return Promise.resolve(true)
  }

  audio.volume = 0
  const playPromise = audio.play()

  if (playPromise !== undefined) {
    return playPromise
      .then(() => {
        musicPlaying = true
        soundEnabled = true
        notifyMusicState()

        // Smooth volume fade-in
        let vol = 0
        fadeInterval = setInterval(() => {
          vol += 0.05
          if (vol >= targetVol) {
            audio.volume = targetVol
            clearInterval(fadeInterval)
            fadeInterval = null
          } else {
            audio.volume = Math.min(vol, targetVol)
          }
        }, 40)
        return true
      })
      .catch((err) => {
        // Autoplay policy prevented immediate unmuted playback; will start on first user gesture
        return false
      })
  }
  return Promise.resolve(false)
}

export function pauseMusic() {
  const audio = getMusicAudio()
  musicWanted = false

  if (!audio) {
    musicPlaying = false
    notifyMusicState()
    return
  }

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

// Global auto-start on page load + seamless fallback on very first user gesture
if (typeof window !== 'undefined') {
  // Attempt to play immediately on load
  const startImmediately = () => {
    if (musicWanted) {
      playMusic().catch(() => {})
    }
  }

  if (document.readyState === 'complete') {
    startImmediately()
  } else {
    window.addEventListener('load', startImmediately, { once: true })
  }

  // Ensure playback starts on the very first user interaction anywhere on page
  const unlockEvents = ['pointerdown', 'mousedown', 'click', 'keydown', 'touchstart']
  const unlockAudio = () => {
    if (musicWanted) {
      playMusic().then((started) => {
        if (started) {
          unlockEvents.forEach((ev) => window.removeEventListener(ev, unlockAudio))
        }
      }).catch(() => {})
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
