import {type Box, type XY, boxHits} from '../../shared/2d.ts'
import {spacePx} from '../../shared/theme.ts'
import type {UTCMillis} from '../../shared/types/time.ts'
import type {Game, LoadedGame} from '../game.ts'
import type {Layer} from '../layer.ts'
import {audioPlay} from '../types/audio.ts'
import {cursorEntHits} from './cursor-ent.ts'
import {EID} from './eid.ts'

export type DiceBeltEnt = Box & {
  layer: Layer
  cast: UTCMillis
  val: number
  readonly type: 'DiceBelt'
  readonly eid: EID
}

const margin: number = 16
const rollMillis: number = 1_250

export function DiceBeltEnt(game: LoadedGame): DiceBeltEnt {
  const w = (game.img.dice.naturalWidth - 5 * margin) / 6
  const h = game.img.dice.naturalHeight
  return {
    eid: EID(),
    layer: 'UI',
    cast: 0 as UTCMillis,
    type: 'DiceBelt',
    val: 1,
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
  c2d.drawImage(
    game.img.dice,
    (belt.val - 1) * (belt.w + margin),
    0,
    belt.w,
    belt.h,
    belt.x,
    belt.y,
    belt.w,
    belt.h
  )
}

export function diceBeltEntUpdate(belt: DiceBeltEnt, game: Game): void {
  belt.x = game.cam.x + game.cam.w / 2 - belt.w / 2
  belt.y = game.cam.y + game.cam.h - belt.h - spacePx * 2

  if (
    !diceBeltEntIsRolling(belt, game.now) &&
    game.ctrl.isOnStart('A') &&
    cursorEntHits(game.cursor, belt, game)
  ) {
    audioPlay(game.audio, game.sound.dice0)
    belt.cast = game.now
  }

  if (diceBeltEntIsRolling(belt, game.now) && game.rnd.num > 0.7)
    belt.val = 1 + Math.trunc(game.rnd.num * 6)
}

export function diceBeltEntIsRolling(
  belt: Readonly<DiceBeltEnt>,
  time: UTCMillis
): boolean {
  return time - belt.cast <= rollMillis
}
