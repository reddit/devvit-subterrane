import {Inven} from './inven.ts'
import type {T2} from './tid.ts'

export const playerDefaultMaxHP: number = 30

export type Player = Profile & {
  cavesEntered: number
  /** posts created. */
  cavesFound: number
  /** health points. */
  hp: number
  hpMax: number
  // to-do: how does player accrue dmg? some kind of base damage? or just always based on dice?
  /** experience points. */
  xp: number
  inven: Inven
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
    cavesEntered: 0,
    cavesFound: 0,
    hp: playerDefaultMaxHP,
    hpMax: playerDefaultMaxHP,
    xp: 0,
    inven: Inven(),
    snoovatarURL: profile.snoovatarURL,
    t2: profile.t2,
    username: profile.username
  }
}
