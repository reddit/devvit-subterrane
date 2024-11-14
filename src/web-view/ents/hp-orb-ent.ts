import {spacePx} from '../../shared/theme.ts'
import type {Box} from '../../shared/types/2d.ts'
import type {Game, LoadedGame} from '../game.ts'
import type {Layer} from '../layer.ts'
import {EID} from './eid.ts'

export type HPOrbEnt = Box & {
  layer: Layer
  readonly type: 'HPOrb'
  readonly eid: EID
}

export function HPOrbEnt(game: Readonly<LoadedGame>): HPOrbEnt {
  const w = game.img.hpOrb.naturalWidth
  return {
    eid: EID(),
    layer: 'UI',
    type: 'HPOrb',
    x: game.cam.x + game.cam.w - w - spacePx / 2,
    y: game.cam.y + spacePx / 2,
    w,
    h: game.img.hpOrb.naturalHeight
  }
}

export function hpOrbEntDraw(
  orb: Readonly<HPOrbEnt>,
  game: Readonly<Game>
): void {
  const {c2d} = game

  c2d.save()

  c2d.beginPath()
  c2d.arc(orb.x + orb.w / 2, orb.y + orb.h / 2, orb.w / 2, 0, 2 * Math.PI)
  c2d.clip()

  c2d.fillStyle = '#990000'
  const full = Math.max(
    game.p1.hp > 0 ? 2 : 0, // clear the border.
    (game.p1.hp / game.p1.maxHP) * orb.h
  )
  c2d.beginPath()
  c2d.fillRect(orb.x, orb.y + orb.h - full, orb.w, full)
  c2d.fillStyle = '#770000'
  if (game.p1.hp) {
    c2d.beginPath()
    c2d.fillRect(orb.x, orb.y + orb.h - full, orb.w, 1)
  }

  c2d.restore()

  c2d.beginPath()
  c2d.drawImage(game.img.hpOrb, orb.x, orb.y)
}

export function hpOrbEntUpdate(orb: HPOrbEnt, game: Game): void {
  orb.x = game.cam.x + game.cam.w - orb.w - spacePx / 2
  orb.y = game.cam.y + spacePx / 2
}
