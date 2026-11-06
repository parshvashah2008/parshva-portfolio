/**
 * Web Audio API Sound Effects Engine
 * Pure synthesized micro-sounds: zero external audio assets, zero latency, 0KB download.
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

// Global sound state (persisted in localStorage, default disabled)
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
