import {type Box, type XY, boxHits} from '../../shared/2d.ts'
import {spacePx} from '../../shared/theme.ts'
import type {UTCMillis} from '../../shared/types/time.ts'
import type {GameState, GameStateDraw} from '../game-state.ts'
import type {Layer} from '../layer.ts'
import {audioPlay} from '../types/audio.ts'
import {cursorHits} from './cursor.ts'
import {EID} from './eid.ts'

export type DiceBelt = Box & {
  layer: Layer
  cast: UTCMillis
  val: number
  readonly type: 'DiceBelt'
  readonly eid: EID
}

const margin: number = 16
const rollMillis: number = 1_250

export function DiceBelt(state: Readonly<GameStateDraw>): DiceBelt {
  const w = (state.img.dice.naturalWidth - 5 * margin) / 6
  const h = state.img.dice.naturalHeight
  return {
    eid: EID(),
    layer: 'Default',
    cast: 0 as UTCMillis,
    type: 'DiceBelt',
    val: 1,
    x: state.cam.x + state.cam.w / 2 - w / 2,
    y: state.cam.y + state.cam.h - h - spacePx * 2,
    w,
    h
  }
}

export function diceBeltDraw(
  belt: Readonly<DiceBelt>,
  state: Readonly<GameState>
): void {
  const {c2d} = state

  c2d.beginPath()
  c2d.drawImage(
    state.img.dice,
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

export function diceBeltUpdate(belt: DiceBelt, state: GameState): void {
  belt.x = state.cam.x + state.cam.w / 2 - belt.w / 2
  belt.y = state.cam.y + state.cam.h - belt.h - spacePx * 2

  if (
    !diceBeltIsRolling(belt, state.now) &&
    state.ctrl.isOnStart('A') &&
    cursorHits(state.cursor, belt)
  ) {
    audioPlay(state.audio, state.sound.dice0)
    belt.cast = state.now
  }

  if (diceBeltIsRolling(belt, state.now) && state.rnd.num > 0.7)
    belt.val = 1 + Math.trunc(state.rnd.num * 6)
}

export function diceBeltIsRolling(
  belt: Readonly<DiceBelt>,
  time: UTCMillis
): boolean {
  return time - belt.cast <= rollMillis
}
