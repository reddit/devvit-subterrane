import type {Random} from '../../shared/types/random.ts'
import type {UTCMillis} from '../../shared/types/time.ts'
import type {InitGame} from '../game.ts'
import {Monster} from './monster.ts'

export type Path = {node: number; nodes: PathNode[]}
export type PathNode = MonsterNode | LootNode
export type LootNode = {
  readonly type: 'Loot'
  item: Item
  phase: 'Paused' | 'Init'
  turn: 'P1'
  updated: UTCMillis
}
export type MonsterNode = {
  readonly type: 'Monster'
  monster: Monster
  turn: 'P1' | 'AI'
  phase: 'Paused' | 'Init' | 'Rolling' | 'Rolled'
  updated: UTCMillis
}
export function MonsterNode(game: InitGame): MonsterNode {
  return {
    type: 'Monster',
    monster: Monster(game),
    turn: game.rnd.num > 0.5 ? 'P1' : 'AI',
    phase: 'Paused',
    updated: 0 as UTCMillis
  }
}

export type Item = {
  readonly loot: 'Pretzel' | 'Rusty Sword'
  hp: number
  dmg: number
}

function Item(rnd: Random): Item {
  const loot =
    rnd.num > 0.9
      ? ({type: 'Rusty Sword', hp: 0, dmg: Math.ceil(rnd.num * 10)} as const)
      : ({type: 'Pretzel', hp: Math.ceil(rnd.num * 10), dmg: 0} as const)
  return {loot: loot.type, hp: loot.hp, dmg: loot.dmg}
}

export function LootNode(rnd: Random): LootNode {
  return {
    type: 'Loot',
    turn: 'P1',
    item: Item(rnd),
    phase: 'Paused',
    updated: 0 as UTCMillis
  }
}
const nodeCnt: number = 3
export function Path(game: InitGame): Path {
  const nodes: PathNode[] = []
  for (let i = 0; i < nodeCnt; i++)
    nodes.push(game.rnd.num > 0.8 ? LootNode(game.rnd) : MonsterNode(game))
  return {node: 0, nodes}
}
