import {type GameState, type GameStateDraw, isGameState} from '../game-state.ts'
import {type Layer, layerDrawOrder} from '../layer.ts'
import {type Cursor, cursorDraw, cursorUpdate} from './cursor.ts'
import {type DiceBelt, diceBeltDraw, diceBeltUpdate} from './dice-belt.ts'
import type {EID} from './eid.ts'
import {type HPOrb, hpOrbDraw, hpOrbUpdate} from './hp-orb.ts'
import {
  type DungeonLevel,
  dungeonLevelDraw,
  dungeonLevelUpdate
} from './levels/dungeon-level.ts'
import {
  TitleLevel,
  titleLevelDraw,
  titleLevelUpdate
} from './levels/title-level.ts'

export type Ent = Cursor | DiceBelt | DungeonLevel | HPOrb | TitleLevel

type EntByID = {[eid: EID]: Ent}

export class Zoo {
  #entsByLayer: {[layer in Layer]: EntByID} = {
    Cursor: {},
    Default: {},
    Level: {},
    UI: {}
  }

  clear(): void {
    this.#entsByLayer = {Cursor: {}, Default: {}, Level: {}, UI: {}}
  }

  draw(state: GameStateDraw): void {
    if (!isGameState(state)) {
      titleLevelDraw(TitleLevel(state), state)
      return
    }

    for (const layer of layerDrawOrder) {
      state.c2d.save()
      if (layer !== 'Cursor' && layer !== 'Level' && layer !== 'UI')
        state.c2d.translate(-state.cam.x, -state.cam.y)

      for (const ent of Object.values(this.#entsByLayer[layer])) {
        switch (ent.type) {
          case 'Cursor':
            cursorDraw(ent, state)
            break
          case 'DiceBelt':
            diceBeltDraw(ent, state)
            break
          case 'HPOrb':
            hpOrbDraw(ent, state)
            break
          case 'DungeonLevel':
            dungeonLevelDraw(ent, state)
            break
          case 'TitleLevel':
            titleLevelDraw(ent, state)
            break
          default:
            ent satisfies never
        }
      }
      state.c2d.restore()
    }
  }

  find(eid: EID): Ent | undefined {
    for (const layer in this.#entsByLayer)
      if (this.#entsByLayer[layer][eid]) return this.#entsByLayer[layer][eid]
  }

  /** only an ent's layer is replaced. */
  replace(...ents: readonly Readonly<Ent>[]): void {
    for (const ent of ents) this.#entsByLayer[ent.layer][ent.eid] = ent
  }

  update(state: GameStateDraw): void {
    if (!isGameState(state)) return

    for (const ent of this.ents()) {
      switch (ent.type) {
        case 'Cursor':
          cursorUpdate(ent, state)
          break
        case 'DiceBelt':
          diceBeltUpdate(ent, state)
          break
        case 'HPOrb':
          hpOrbUpdate(ent, state)
          break
        case 'DungeonLevel':
          dungeonLevelUpdate(ent, state)
          break
        case 'TitleLevel':
          titleLevelUpdate(ent, state)
          break
        default:
          ent satisfies never
      }
    }
  }

  remove(...ents: readonly Readonly<Ent>[]): void {
    for (const ent of ents) {
      for (const layer of Object.values(this.#entsByLayer)) {
        if (!layer[ent.eid]) continue
        delete layer[ent.eid]
        break
      }
    }
  }

  *ents(): Generator<Ent> {
    for (const layer of layerDrawOrder)
      for (const ent of Object.values(this.#entsByLayer[layer])) yield ent
  }
}
