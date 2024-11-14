import type {Assets} from '../assets.ts'

export type Audio = AudioBufferByName & {ctx: AudioContext}
export type AudioBufferByName = {[name in keyof Assets['audio']]: AudioBuffer}

export async function Audio(assets: Readonly<Assets>): Promise<Audio> {
  const ctx = new AudioContext()
  const [dice0] = await Promise.all([ctx.decodeAudioData(assets.audio.dice0)])
  return {ctx, dice0}
}

export function audioPlay(
  ctx: AudioContext,
  buf: AudioBuffer,
  drop: boolean = false
): void {
  if (drop && ctx.state !== 'running') return // prevent queuing sounds.

  const src = ctx.createBufferSource()
  src.buffer = buf
  src.connect(ctx.destination)
  src.start()
}

export function audioBeep(
  ctx: AudioContext,
  type: OscillatorType,
  startHz: number,
  endHz: number,
  duration: number
): void {
  if (ctx.state !== 'running') return // prevent queuing sounds.
  const now = ctx.currentTime
  const end = now + duration

  const oscillator = ctx.createOscillator()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(startHz, now)
  oscillator.frequency.exponentialRampToValueAtTime(endHz, end)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.5, now)
  gain.gain.exponentialRampToValueAtTime(0.01, end)

  oscillator.connect(gain)
  gain.connect(ctx.destination)

  oscillator.start()
  oscillator.stop(end)
}
