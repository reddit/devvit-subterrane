import {paletteBackground, spacePx} from '../../../shared/theme.ts'
import type {Box} from '../../../shared/types/2d.ts'
import type {Game} from '../../game.ts'
import type {Layer} from '../../layer.ts'
import {DiceBeltEnt} from '../dice-belt-ent.ts'
import {EID} from '../eid.ts'
import {HPOrbEnt} from '../hp-orb-ent.ts'
import {PathNodeEnt} from '../path-node-ent.ts'
import {PathStatusEnt} from '../path-status-ent.ts'

export type CharLevelEnt = Box & {
  readonly eid: EID
  ent: PathNodeEnt
  layer: Layer
  readonly type: 'CharLevel'
}

export function CharLevelEnt(game: Game): CharLevelEnt {
  const {zoo} = game
  // state.ctrl.allowContextMenu = false
  zoo.clear()
  const belt = DiceBeltEnt(game)
  const ent = PathNodeEnt(game, game.path.nodes[game.path.node]!, belt)
  ent.node.updated = game.now
  zoo.replace(game.cursor, HPOrbEnt(game), belt, PathStatusEnt(game), ent)
  // state.p1.hp = playerDefaultHP
  // state.p1.score = 0
  // state.p1.x = state.p1.y = 4800

  return {
    eid: EID(),
    layer: 'Level',
    ent,
    type: 'CharLevel',
    x: 0,
    y: 0,
    w: game.cam.minWH.w,
    h: game.cam.minWH.h
  }
}

export function charLevelEntDraw(
  _lvl: Readonly<CharLevelEnt>,
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

export function charLevelEntUpdate(_lvl: CharLevelEnt, _game: Game): void {
  // if (
  //   (state.init && state.p1.t2 !== state.author.t2) ||
  //   state.completed ||
  //   state.p1.hp <= 0
  // ) {
  //   if (state.p1.t2 === state.author.t2 && !state.completed)
  //     // only send game over if player triggered it and we're not revisiting an
  //     // old game.
  //     postMessage({type: 'GameOver', score: state.p1.score, id: state.msgID})
  // state.zoo.remove(lvl)
  // state.zoo.replace(DungeonLevel(state))
  // }
}
