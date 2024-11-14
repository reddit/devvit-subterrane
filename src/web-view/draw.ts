import type {Box, XY} from '../shared/types/2d.ts'
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

export function drawText(
  c2d: C2D,
  text: string,
  opts: Readonly<
    XY & {
      justify?:
        | 'Center'
        | 'BottomLeft'
        | 'BottomRight'
        | 'TopLeft'
        | 'TopRight'
        | 'TopCenter' // to-do: rethink terminology.
      fill?: string
      size?: number
      stroke?: string
    }
  >
): Box {
  if (opts.fill) c2d.fillStyle = opts.fill
  c2d.font = `${opts.size ? opts.size : 12}px mem`
  if (opts.stroke) c2d.strokeStyle = opts.stroke
  c2d.lineWidth = 4
  c2d.beginPath()
  const metrics = c2d.measureText(text)
  let x = opts.x
  let y = opts.y
  const justify = opts.justify ?? 'TopLeft'
  switch (justify) {
    case 'BottomLeft':
      x += c2d.lineWidth
      y -= c2d.lineWidth
      break
    case 'BottomRight':
      x -= metrics.width + c2d.lineWidth
      y -= c2d.lineWidth
      break
    case 'Center':
      x -= Math.trunc(metrics.width / 2)
      y -= Math.trunc(
        (metrics.actualBoundingBoxAscent +
          metrics.actualBoundingBoxDescent +
          c2d.lineWidth * 2) /
          2
      )
      break
    case 'TopLeft':
      y +=
        metrics.actualBoundingBoxAscent +
        metrics.actualBoundingBoxDescent +
        c2d.lineWidth
      break
    case 'TopCenter':
      x -= Math.trunc((metrics.width + c2d.lineWidth) / 2)
      y +=
        metrics.actualBoundingBoxAscent +
        metrics.actualBoundingBoxDescent +
        c2d.lineWidth
      break
    case 'TopRight':
      x -= metrics.width + c2d.lineWidth
      y +=
        metrics.actualBoundingBoxAscent +
        metrics.actualBoundingBoxDescent +
        c2d.lineWidth
      break
    default:
      justify satisfies never
  }
  if (opts.stroke) c2d.strokeText(text, x, y)
  if (opts.fill) c2d.fillText(text, x, y)
  const h =
    metrics.actualBoundingBoxAscent +
    metrics.actualBoundingBoxDescent +
    c2d.lineWidth * 2
  // to-do: declare w/h above and use there and here. figure out if I need
  // different x/y offsets for each case too.
  return {x, y: y - h, w: c2d.lineWidth * 2 + metrics.width, h}
}
