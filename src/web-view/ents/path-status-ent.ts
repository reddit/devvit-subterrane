import {spacePx} from '../../shared/theme.ts'
import type {Box} from '../../shared/types/2d.ts'
import type {Game, InitGame} from '../game.ts'
import type {Layer} from '../layer.ts'
import {EID} from './eid.ts'

export type PathStatusEnt = Box & {
  layer: Layer
  readonly type: 'PathStatus'
  readonly eid: EID
}

const nodeRadiusPx: number = 8

export function PathStatusEnt(game: InitGame): PathStatusEnt {
  const w = 128
  const h = 16
  return {
    eid: EID(),
    layer: 'UI',
    type: 'PathStatus',
    x: game.cam.x + game.cam.w / 2 - w / 2,
    y: game.cam.y + spacePx * 4.5,
    w,
    h
  }
}

export function pathStatusEntDraw(
  stat: Readonly<PathStatusEnt>,
  game: Readonly<Game>
): void {
  const {c2d, path} = game

  c2d.lineWidth = 3
  c2d.strokeStyle = '#eaeaea'
  for (const [i, node] of path.nodes.entries()) {
    c2d.beginPath()
    c2d.arc(
      stat.x + i * (64 - nodeRadiusPx) + nodeRadiusPx,
      stat.y,
      nodeRadiusPx,
      0,
      2 * Math.PI
    )
    if (path.node === i) {
      c2d.fillStyle = '#eaeaea40'
      c2d.fill()
    } else if (path.node > i) {
      c2d.fillStyle = '#eaeaea'
      c2d.fill()
    }
    c2d.stroke()
    if (i === path.nodes.length - 1) break
    c2d.fillStyle = '#eaeaea'
    for (let ii = 0; ii < 3; ii++) {
      c2d.beginPath()
      c2d.arc(
        stat.x +
          i * (64 - nodeRadiusPx) +
          nodeRadiusPx +
          16 +
          (ii * 12 - 2) +
          2,
        stat.y,
        2,
        0,
        2 * Math.PI
      )
      c2d.fill()
    }
  }
}

export function pathStatusEntUpdate(stat: PathStatusEnt, game: Game): void {
  stat.x = game.cam.x + game.cam.w / 2 - stat.w / 2
  stat.y = game.cam.y + spacePx * 4.5
}
