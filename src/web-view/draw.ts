import type {Assets} from './assets.ts'

export type C2D = CanvasRenderingContext2D
export type Canvas = HTMLCanvasElement

export type Draw = {c2d: C2D; checkerboard: CanvasPattern}

export function Draw(
  assets: Readonly<Assets>,
  canvas: HTMLCanvasElement
): Draw | undefined {
  const c2d =
    canvas.getContext('2d', {alpha: false, willReadFrequently: false}) ??
    undefined
  if (!c2d) return
  const checkerboard = c2d.createPattern(assets.img.checkerboard, 'repeat')
  if (!checkerboard) return
  return {c2d, checkerboard}
}
