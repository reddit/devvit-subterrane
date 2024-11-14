import type {Game} from '../game.ts'
import {type Layer, layerDrawOrder} from '../layer.ts'
import {type CursorEnt, cursorEntDraw, cursorUpdate} from './cursor-ent.ts'
import {
  type DiceBeltEnt,
  diceBeltEntDraw,
  diceBeltEntUpdate
} from './dice-belt-ent.ts'
import type {EID} from './eid.ts'
import {type HPOrbEnt, hpOrbEntDraw, hpOrbEntUpdate} from './hp-orb-ent.ts'
import {type ItemEnt, itemEntDraw, itemEntUpdate} from './item-ent.ts'
import {
  type DungeonLevelEnt,
  dungeonLevelEntDraw,
  dungeonLevelEntUpdate
} from './levels/dungeon-level-ent.ts'
import {
  type TitleLevelEnt,
  titleLevelEntDraw,
  titleLevelEntUpdate
} from './levels/title-level-ent.ts'
import {
  type MonsterEnt,
  monsterEntDraw,
  monsterEntUpdate
} from './monster-ent.ts'
import {
  type PathStatusEnt,
  pathStatusEntDraw,
  pathStatusEntUpdate
} from './path-status-ent.ts'

export type Ent =
  | CursorEnt
  | DiceBeltEnt
  | DungeonLevelEnt
  | HPOrbEnt
  | ItemEnt
  | MonsterEnt
  | PathStatusEnt
  | TitleLevelEnt

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

  draw(game: Game): void {
    for (const layer of layerDrawOrder) {
      game.c2d.save()
      if (layer !== 'Cursor' && layer !== 'Level' && layer !== 'UI')
        game.c2d.translate(-game.cam.x, -game.cam.y)

      for (const ent of Object.values(this.#entsByLayer[layer])) {
        switch (ent.type) {
          case 'Cursor':
            cursorEntDraw(ent, game)
            break
          case 'DiceBelt':
            diceBeltEntDraw(ent, game)
            break
          case 'DungeonLevel':
            dungeonLevelEntDraw(ent, game)
            break
          case 'HPOrb':
            hpOrbEntDraw(ent, game)
            break
          case 'Item':
            itemEntDraw(ent, game)
            break
          case 'Monster':
            monsterEntDraw(ent, game)
            break
          case 'PathStatus':
            pathStatusEntDraw(ent, game)
            break
          case 'TitleLevel':
            titleLevelEntDraw(ent, game)
            break
          default:
            ent satisfies never
        }
      }
      game.c2d.restore()
    }
  }

  find(eid: EID): Ent | undefined {
    for (const layer in this.#entsByLayer)
      if (this.#entsByLayer[layer as Layer][eid])
        return this.#entsByLayer[layer as Layer][eid]
  }

  /** only an ent's layer is replaced. */
  replace(...ents: readonly Readonly<Ent>[]): void {
    for (const ent of ents) this.#entsByLayer[ent.layer][ent.eid] = ent
  }

  update(game: Game): void {
    cursorUpdate(game.cursor, game) // update first to align to input edges.
    for (const ent of this.ents()) {
      switch (ent.type) {
        case 'Cursor':
          break
        case 'DiceBelt':
          diceBeltEntUpdate(ent, game)
          break
        case 'DungeonLevel':
          dungeonLevelEntUpdate(ent, game)
          break
        case 'HPOrb':
          hpOrbEntUpdate(ent, game)
          break
        case 'Item':
          itemEntUpdate(ent, game)
          break
        case 'Monster':
          monsterEntUpdate(ent, game)
          break
        case 'PathStatus':
          pathStatusEntUpdate(ent, game)
          break
        case 'TitleLevel':
          titleLevelEntUpdate(ent, game)
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
