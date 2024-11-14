import type {Random} from '../../shared/types/random.ts'
import type {UTCMillis} from '../../shared/types/time.ts'
import {Monster} from './monster.ts'

export type Path = {node: number; nodes: PathNode[]}
export type PathNode = BattleNode | LootNode
export type LootNode = {readonly type: 'Loot'; item: Item; updated: UTCMillis}
export type BattleNode = {
  readonly type: 'Battle'
  monster: Monster
  turn: 'P1' | 'AI'
  phase: 'Init' | 'Rolling' | 'Rolled'
  updated: UTCMillis
}
export function BattleNode(rnd: Random): BattleNode {
  return {
    type: 'Battle',
    monster: Monster(rnd),
    turn: rnd.num > 0.5 ? 'P1' : 'AI',
    phase: 'Init',
    updated: 0 as UTCMillis
  }
}

export type Item = {
  readonly loot: 'Apple' | 'Rusty Sword'
  hp: number
  dmg: number
}

function Item(rnd: Random): Item {
  const loot =
    rnd.num > 0.9
      ? ({type: 'Rusty Sword', hp: 0, dmg: Math.ceil(rnd.num * 10)} as const)
      : ({type: 'Apple', hp: Math.ceil(rnd.num * 10), dmg: 0} as const)
  return {loot: loot.type, hp: loot.hp, dmg: loot.dmg}
}

export function LootNode(rnd: Random): LootNode {
  return {type: 'Loot', item: Item(rnd), updated: 0 as UTCMillis}
}
const nodeCnt: number = 3
export function Path(rnd: Random): Path {
  const nodes: PathNode[] = []
  for (let i = 0; i < nodeCnt; i++)
    nodes.push(rnd.num > 0.8 ? BattleNode(rnd) : BattleNode(rnd))
  return {node: 0, nodes}
}
