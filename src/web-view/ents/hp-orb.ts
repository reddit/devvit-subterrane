import type {Box} from '../../shared/2d.ts'
import {spacePx} from '../../shared/theme.ts'
import type {GameState, GameStateDraw} from '../game-state.ts'
import type {Layer} from '../layer.ts'
import {EID} from './eid.ts'

export type HPOrb = Box & {
  layer: Layer
  readonly type: 'HPOrb'
  readonly eid: EID
}

export function HPOrb(state: Readonly<GameStateDraw>): HPOrb {
  const w = state.img.hpOrb.naturalWidth
  return {
    eid: EID(),
    layer: 'Default',
    type: 'HPOrb',
    x: state.cam.x + state.cam.w - w - spacePx / 2,
    y: state.cam.y + spacePx / 2,
    w,
    h: state.img.hpOrb.naturalHeight
  }
}

export function hpOrbDraw(
  orb: Readonly<HPOrb>,
  state: Readonly<GameState>
): void {
  const {c2d} = state

  c2d.save()

  c2d.beginPath()
  c2d.arc(orb.x + orb.w / 2, orb.y + orb.h / 2, orb.w / 2, 0, 2 * Math.PI)
  c2d.clip()

  c2d.fillStyle = '#990000'
  const full = (state.p1.hp / state.p1.maxHP) * orb.h
  c2d.beginPath()
  c2d.fillRect(orb.x, orb.y + orb.h - full, orb.w, full)
  c2d.fillStyle = '#770000'
  if (state.p1.hp) {
    c2d.beginPath()
    c2d.fillRect(orb.x, orb.y + orb.h - full, orb.w, 1)
  }

  c2d.restore()

  c2d.beginPath()
  c2d.drawImage(state.img.hpOrb, orb.x, orb.y)
}

export function hpOrbUpdate(orb: HPOrb, state: GameState): void {
  orb.x = state.cam.x + state.cam.w - orb.w - spacePx / 2
}
