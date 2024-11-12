import {type Box, type WH, type XY, boxHits} from '../../shared/2d.js'
import type {GameState, GameStateUnknown} from '../game-state.js'
import type {Layer} from '../layer.js'
import {EID} from './eid.js'

export type Cursor = Box & {
  hidden: boolean
  layer: Layer
  readonly type: 'Cursor'
  readonly eid: EID
}

const hitbox: Readonly<Box> = {x: 20, y: 1, w: 7, h: 7}

export function Cursor(state: Readonly<GameStateUnknown>): Cursor {
  return {
    eid: EID(),
    hidden: true,
    layer: 'Cursor',
    type: 'Cursor',
    x: 0,
    y: 0,
    w: state.img.cursor.naturalWidth / 2,
    h: state.img.cursor.naturalHeight
  }
}

export function cursorHits(
  cursor: Readonly<Cursor>,
  box: Readonly<XY & Partial<WH>>
): boolean {
  return boxHits({x: cursor.x, y: cursor.y, w: hitbox.w, h: hitbox.h}, box)
}

export function cursorDraw(
  cursor: Readonly<Cursor>,
  state: Readonly<GameState>
): void {
  if (cursor.hidden) return
  state.c2d.beginPath()
  state.c2d.drawImage(
    state.img.cursor,
    state.ctrl.isOn('A') ? cursor.w : 0,
    0,
    cursor.w,
    cursor.h,
    cursor.x,
    cursor.y,
    cursor.w,
    cursor.h
  )
}

export function cursorUpdate(cursor: Cursor, state: GameState): void {
  if (state.ctrl.pointOn && state.ctrl.pointType === 'mouse')
    cursor.hidden = false
  else if (state.ctrl.isAnyOn('L', 'R', 'U', 'D')) cursor.hidden = true
  const pt = state.cam.toLevelXY(state.ctrl.clientPoint)
  cursor.x = Math.round(pt.x) - state.cam.x - hitbox.x
  cursor.y = Math.round(pt.y) - state.cam.y - hitbox.y
}
