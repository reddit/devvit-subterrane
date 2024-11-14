import type {Box} from '../../shared/2d.ts'
import {spacePx} from '../../shared/theme.ts'
import type {UTCMillis} from '../../shared/types/time.ts'
import {drawText} from '../draw.ts'
import type {Game} from '../game.ts'
import type {Layer} from '../layer.ts'
import {EID} from './eid.ts'
import type {Monster} from './monster.ts'

export type MonsterEnt = Box & {
  layer: Layer
  monster: Monster
  readonly type: 'Monster'
  readonly eid: EID
}

const margin: number = 16

export function MonsterEnt(game: Game, monster: Monster): MonsterEnt {
  const w = (game.img.dice.naturalWidth - 5 * margin) / 6
  const h = game.img.dice.naturalHeight
  const ent: MonsterEnt = {
    monster,
    eid: EID(),
    layer: 'Default',
    type: 'Monster',
    x: game.cam.x + game.cam.w / 2 - w / 2,
    y: game.cam.y + game.cam.h - h - spacePx * 2,
    w,
    h
  }
  return ent
}

export function monsterEntDraw(
  monster: Readonly<MonsterEnt>,
  game: Readonly<Game>
): void {
  const {c2d, cam, img} = game

  c2d.beginPath()
  c2d.drawImage(
    img.monster,
    cam.w / 2 - img.monster.naturalWidth / 2,
    cam.h / 2 - img.monster.naturalHeight / 2
  )

  const x = cam.w / 2 - img.fog.naturalWidth / 2
  const y = cam.h / 2 - img.fog.naturalHeight / 2
  c2d.save()
  c2d.translate(cam.w / 2, cam.h / 2)
  const angle = -((game.now % 60_000) / 60_000) * Math.PI * 2
  // c2d.rotate(angle)
  c2d.translate(-cam.w / 2, -cam.h / 2)

  c2d.beginPath()
  c2d.drawImage(img.fog, x, y, img.fog.naturalWidth, img.fog.naturalHeight)

  c2d.globalCompositeOperation = 'hue'
  c2d.fillStyle = 'hsl(12deg, 100%, 50%)' // 15 degree hue shift
  c2d.fillRect(0, 0, img.fog.naturalWidth, img.fog.naturalHeight)
  c2d.globalCompositeOperation = 'source-over' // Reset composite mode

  // c2d.drawImage(
  //   img.fog,
  //   ratio * img.fog.naturalWidth,
  //   ratio * img.fog.naturalHeight,
  //   img.fog.naturalWidth,
  //   img.fog.naturalHeight,
  //   cam.w / 2 - img.fog.naturalWidth / 2,
  //   cam.h / 2 - img.fog.naturalHeight / 2,
  //   img.fog.naturalWidth,
  //   img.fog.naturalHeight
  // )
  c2d.restore()

  drawText(
    c2d,
    `${monster.monster.modifier.toLowerCase()} ${monster.monster.species.toLowerCase()} ${monster.monster.class.toLowerCase()}`,
    {
      fill: '#eaeaea',
      justify: 'TopCenter',
      x: Math.trunc(cam.w / 2),
      y: cam.y + spacePx / 2
    }
  )

  drawText(c2d, `${999}`, {
    fill: '#990000',
    justify: 'Center',
    size: 24,
    x: Math.trunc(cam.w / 2),
    y: cam.y + cam.h - spacePx * 10
  }) // to-do:palette.

  // c2d.beginPath()
  // c2d.drawImage(
  //   state.img.dice,
  //   (monster.val - 1) * (monster.w + margin),
  //   0,
  //   monster.w,
  //   monster.h,
  //   monster.x,
  //   monster.y,
  //   monster.w,
  //   monster.h
  // )
}

export function monsterEntUpdate(monster: MonsterEnt, game: Game): void {
  // monster.x = state.cam.x + state.cam.w / 2 - monster.w / 2
  // monster.y = state.cam.y + state.cam.h - monster.h - spacePx * 2
  // if (
  //   !monsterIsRolling(monster, state.now) &&
  //   state.ctrl.isOnStart('A') &&
  //   cursorHits(state.cursor, monster)
  // ) {
  //   audioPlay(state.audio, state.sound.dice0)
  //   monster.cast = state.now
  // }
  // if (monsterIsRolling(monster, state.now) && state.rnd.num > 0.7)
  //   monster.val = 1 + Math.trunc(state.rnd.num * 6)
}

export function monsterEntIsRolling(
  monster: Readonly<MonsterEnt>,
  time: UTCMillis
): boolean {
  return time - monster.cast <= rollMillis
}
