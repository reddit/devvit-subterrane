import type {Box} from '../../../shared/types/2d.ts'
import type {Game, InitGame} from '../../game.ts'
import type {Layer} from '../../layer.ts'
import {DiceBeltEnt} from '../dice-belt-ent.ts'
import {EID} from '../eid.ts'
import {HPOrbEnt} from '../hp-orb-ent.ts'
import {PathNodeEnt} from '../path-node-ent.ts'
import {PathStatusEnt} from '../path-status-ent.ts'

export type CaveLevelEnt = Box & {
  readonly eid: EID
  ent: PathNodeEnt
  layer: Layer
  readonly type: 'CaveLevel'
}

export function CaveLevelEnt(game: InitGame): CaveLevelEnt {
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
    type: 'CaveLevel',
    x: 0,
    y: 0,
    w: game.cam.minWH.w,
    h: game.cam.minWH.h
  }
}

export function caveLevelEntDraw(
  _lvl: Readonly<CaveLevelEnt>,
  _game: Readonly<Game>
): void {
  // c2d.moveTo(0, 0)
  // c2d.lineTo(0, canvas.width)
  // c2d.lineTo(canvas.height, canvas.width)
  // c2d.lineTo(canvas.height, 0)
  // c2d.closePath()
}

export function caveLevelEntUpdate(_lvl: CaveLevelEnt, _game: Game): void {
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
