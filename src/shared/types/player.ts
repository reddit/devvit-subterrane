import {Inven} from './inven.ts'
import type {T2, T3} from './tid.ts'

export const playerDefaultMaxHP: number = 30

export type Player = Profile & {
  /** caves / posts created. */
  discovered: T3[]
  /** health points. */
  hp: number
  hpMax: number
  // to-do: how does player accrue dmg? some kind of base damage? or just always based on dice?
  /** experience points. */
  xp: number
  inven: Inven
  journey: T3[]
}

export type Profile = {
  /** avatar image URL. */
  snoovatarURL: string
  /** player user ID. t2_0 for anons. */
  t2: T2
  /** player username. eg, spez. */
  username: string
}

export function Player(profile: Readonly<Profile>): Player {
  return {
    discovered: [],
    journey: [],
    hp: playerDefaultMaxHP,
    hpMax: playerDefaultMaxHP,
    xp: 0,
    inven: Inven(),
    snoovatarURL: profile.snoovatarURL,
    t2: profile.t2,
    username: profile.username
  }
}
