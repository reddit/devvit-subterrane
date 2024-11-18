export const lootGridSide: number = 3

export type Inven = {
  /** sparse loot grid. */
  grid: Loot[]
  swap: Loot | undefined
}

// move to schema
export type Loot =
  | {readonly type: 'Small Blood'; hpAdd: number}
  | {readonly type: 'Rusty Sword'; dmgAdd: number}
  | {readonly type: 'Big Tonic'; hpMul: number}

export function Inven(): Inven {
  return {grid: [], swap: undefined}
}
