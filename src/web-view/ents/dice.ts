import type {Random} from '../../shared/types/random.ts'

const sides: number = 6

export type Dice = {val: number}

export function Dice(): Dice {
  return {val: 1}
}

export function diceRoll(dice: Dice, rnd: Random): void {
  dice.val = 1 + Math.trunc(rnd.num * sides)
}
