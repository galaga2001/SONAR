import { useEffect, useRef } from 'react'

// Generates ambient ocean hum + a sonar ping using the Web Audio API so the app
// needs no binary audio assets. Returns { ping } and reacts to `muted`.
export default function useAudio(muted) {
  const ctxRef = useRef(null)
  const humGainRef = useRef(null)

  const ensureContext = () => {
    if (ctxRef.current) return ctxRef.current
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return null
    const ctx = new Ctx()
    ctxRef.current = ctx

    // ---- low ocean hum: filtered brown noise ----
    const bufferSize = 2 * ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.5
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    noise.loop = true

    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 180

    const gain = ctx.createGain()
    gain.gain.value = 0 // start silent; faded in when unmuted
    humGainRef.current = gain

    noise.connect(lp).connect(gain).connect(ctx.destination)
    noise.start(0)
    return ctx
  }

  // react to mute state
  useEffect(() => {
    const ctx = ctxRef.current
    if (!ctx || !humGainRef.current) return
    const now = ctx.currentTime
    humGainRef.current.gain.cancelScheduledValues(now)
    humGainRef.current.gain.linearRampToValueAtTime(muted ? 0 : 0.05, now + 0.8)
    if (!muted && ctx.state === 'suspended') ctx.resume()
  }, [muted])

  const ping = () => {
    if (muted) return
    const ctx = ensureContext()
    if (!ctx) return
    if (ctx.state === 'suspended') ctx.resume()
    // also bring hum up now that we have a user gesture
    if (humGainRef.current) {
      const now0 = ctx.currentTime
      humGainRef.current.gain.cancelScheduledValues(now0)
      humGainRef.current.gain.linearRampToValueAtTime(0.05, now0 + 0.8)
    }

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.4)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.12, now + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.9)
    osc.connect(g).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 1)
  }

  // initialise the context lazily on first unmute too
  useEffect(() => {
    if (!muted) ensureContext()
  }, [muted])

  return { ping }
}
