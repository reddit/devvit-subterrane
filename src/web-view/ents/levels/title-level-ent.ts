import type {Box} from '../../../shared/2d.ts'
import {paletteBackground, spacePx} from '../../../shared/theme.ts'
import type {ConstructedGame, Game} from '../../game.ts'
import type {Layer} from '../../layer.ts'
import {EID} from '../eid.ts'
import {DungeonLevelEnt} from './dungeon-level-ent.ts'

export type TitleLevelEnt = Box & {
  readonly eid: EID
  layer: Layer
  readonly type: 'TitleLevel'
}

export function TitleLevelEnt(game: ConstructedGame): TitleLevelEnt {
  const {zoo} = game
  // state.ctrl.allowContextMenu = false
  // zoo.clear()
  // zoo.replace(Cursor(), Score(), Status())
  // state.p1.hp = playerDefaultHP
  // state.p1.score = 0
  // state.p1.x = state.p1.y = 4800

  return {
    eid: EID(),
    layer: 'Level',
    type: 'TitleLevel',
    x: game.cam.x,
    y: game.cam.y,
    w: game.cam.minWH.w,
    h: game.cam.minWH.h
  }
}

export function titleLevelEntDraw(
  _lvl: Readonly<TitleLevelEnt>,
  game: Readonly<Game>
): void {
  const {c2d, cam} = game

  c2d.save()
  c2d.translate(-game.cam.x, -game.cam.y)

  c2d.fillStyle = '#eaeaea'
  c2d.beginPath()
  c2d.fillRect(cam.x, cam.y, cam.w, cam.h)
  c2d.lineWidth = 2
  c2d.strokeStyle = '#111'
  c2d.fillStyle = '#eaeaea'
  c2d.beginPath()
  c2d.roundRect(
    c2d.lineWidth,
    c2d.lineWidth,
    cam.w - 2 * c2d.lineWidth,
    cam.h - 2 * c2d.lineWidth,
    spacePx
  )
  c2d.stroke()
  c2d.fill()
  c2d.fillStyle = paletteBackground
  c2d.beginPath()
  c2d.roundRect(
    c2d.lineWidth,
    c2d.lineWidth,
    cam.w - 2 * c2d.lineWidth,
    cam.h - 2 * c2d.lineWidth,
    spacePx
  )
  c2d.fill()

  c2d.restore()

  // c2d.moveTo(0, 0)
  // c2d.lineTo(0, canvas.width)
  // c2d.lineTo(canvas.height, canvas.width)
  // c2d.lineTo(canvas.height, 0)
  // c2d.closePath()
}

export function titleLevelEntUpdate(lvl: TitleLevelEnt, game: Game): void {
  console.log('titleLevelUpdate')
  // if (
  //   (state.init && state.p1.t2 !== state.author.t2) ||
  //   state.completed ||
  //   state.p1.hp <= 0
  // ) {
  //   if (state.p1.t2 === state.author.t2 && !state.completed)
  //     // only send game over if player triggered it and we're not revisiting an
  //     // old game.
  //     postMessage({type: 'GameOver', score: state.p1.score, id: state.msgID})
  // if (game.img) {
  game.zoo.remove(lvl)
  game.zoo.replace(DungeonLevelEnt(game))
  // } // }
}
