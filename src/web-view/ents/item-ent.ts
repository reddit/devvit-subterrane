import type {Box} from '../../shared/2d.ts'
import {spacePx} from '../../shared/theme.ts'
import type {Game} from '../game.ts'
import type {Layer} from '../layer.ts'
import {EID} from './eid.ts'

export type ItemEnt = Box & {
  layer: Layer
  readonly type: 'Item'
  readonly eid: EID
  item: ItemEnt
}

export function ItemEnt(game: Game): ItemEnt {
  const w = game.img.item.naturalWidth
  return {
    eid: EID(),
    layer: 'UI',
    type: 'Item',
    x: game.cam.x + game.cam.w - w - spacePx / 2,
    y: game.cam.y + spacePx / 2,
    w,
    h: game.img.item.naturalHeight
  }
}

export function itemEntDraw(
  item: Readonly<ItemEnt>,
  game: Readonly<Game>
): void {
  const {c2d} = game

  c2d.save()

  c2d.beginPath()
  c2d.arc(item.x + item.w / 2, item.y + item.h / 2, item.w / 2, 0, 2 * Math.PI)
  c2d.clip()

  c2d.fillStyle = '#990000'
  const full = Math.max(
    game.p1.hp > 0 ? 2 : 0, // clear the border.
    (game.p1.hp / game.p1.maxHP) * item.h
  )
  c2d.beginPath()
  c2d.fillRect(item.x, item.y + item.h - full, item.w, full)
  c2d.fillStyle = '#770000'
  if (game.p1.hp) {
    c2d.beginPath()
    c2d.fillRect(item.x, item.y + item.h - full, item.w, 1)
  }

  c2d.restore()

  c2d.beginPath()
  c2d.drawImage(game.img.item, item.x, item.y)
}

export function itemEntUpdate(item: ItemEnt, game: Game): void {
  item.x = game.cam.x + game.cam.w - item.w - spacePx / 2
  item.y = game.cam.y + spacePx / 2
}
