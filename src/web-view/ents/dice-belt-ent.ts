import {spacePx} from '../../shared/theme.ts'
import type {Box} from '../../shared/types/2d.ts'
import type {Game, LoadedGame} from '../game.ts'
import type {Layer} from '../layer.ts'
import {EID} from './eid.ts'

export type DiceBeltEnt = Box & {
  layer: Layer
  readonly type: 'DiceBelt'
  readonly eid: EID
}

const margin: number = 16

export function DiceBeltEnt(game: LoadedGame): DiceBeltEnt {
  const w = (game.img.dice.naturalWidth - 5 * margin) / 6
  const h = game.img.dice.naturalHeight
  return {
    eid: EID(),
    layer: 'UI',
    type: 'DiceBelt',
    x: game.cam.x + game.cam.w / 2 - w / 2,
    y: game.cam.y + game.cam.h - h - spacePx * 2,
    w,
    h
  }
}

// to-do: would love for ents to be sack of data but I need a build step to dump image sizes like atlas-pack for aseprite.

export function diceBeltEntDraw(
  belt: Readonly<DiceBeltEnt>,
  game: Readonly<Game>
): void {
  const {c2d} = game

  c2d.beginPath()
  if (game.path.nodes[game.path.node]!.turn !== 'P1') c2d.globalAlpha = 0.25
  c2d.drawImage(
    game.img.dice,
    (game.dice.val - 1) * (belt.w + margin),
    0,
    belt.w,
    belt.h,
    belt.x,
    belt.y,
    belt.w,
    belt.h
  )
  c2d.globalAlpha = 1
}

export function diceBeltEntUpdate(belt: DiceBeltEnt, game: Game): void {
  belt.x = game.cam.x + game.cam.w / 2 - belt.w / 2
  belt.y = game.cam.y + game.cam.h - belt.h - spacePx * 2
}
