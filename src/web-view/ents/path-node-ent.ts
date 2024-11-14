import {spacePx} from '../../shared/theme.ts'
import type {Box} from '../../shared/types/2d.ts'
import {drawText} from '../draw.ts'
import type {Game} from '../game.ts'
import type {Layer} from '../layer.ts'
import {audioPlay} from '../types/audio.ts'
import {cursorEntHits} from './cursor-ent.ts'
import type {DiceBeltEnt} from './dice-belt-ent.ts'
import {diceRoll} from './dice.ts'
import {EID} from './eid.ts'
import {GameOverLevelEnt} from './levels/game-over-level-ent.ts'
import {rollDmg} from './monster.ts'
import type {PathNode} from './path.ts'

export type PathNodeEnt = Box & {
  layer: Layer
  belt: DiceBeltEnt
  node: PathNode
  dmg: number
  readonly type: 'PathNode'
  readonly eid: EID
}

const rollMillis: number = 1_250
const rolledMillis: number = 3_000
const pausedMillis: number = 2_000
const margin: number = 16

export function PathNodeEnt(
  game: Game,
  node: PathNode,
  belt: DiceBeltEnt
): PathNodeEnt {
  const w = (game.img.dice.naturalWidth - 5 * margin) / 6
  const h = game.img.dice.naturalHeight
  const ent: PathNodeEnt = {
    node,
    eid: EID(),
    belt,
    dmg: 0,
    layer: 'Default',
    type: 'PathNode',
    x: game.cam.x + game.cam.w / 2 - w / 2,
    y: game.cam.y + game.cam.h - h - spacePx * 2,
    w,
    h
  }
  return ent
}

export function pathNodeEntDraw(
  path: Readonly<PathNodeEnt>,
  game: Readonly<Game>
): void {
  const {c2d, cam, img} = game
  const node = game.path.nodes[game.path.node]!

  const nodeImg = img[node.type === 'Loot' ? 'loot' : 'monster']
  c2d.beginPath()
  c2d.drawImage(
    nodeImg,
    cam.w / 2 - nodeImg.naturalWidth / 2,
    cam.h / 2 - nodeImg.naturalHeight / 2
  )

  const x = cam.w / 2 - img.fog.naturalWidth / 2
  const y = cam.h / 2 - img.fog.naturalHeight / 2
  c2d.save()
  c2d.translate(cam.w / 2, cam.h / 2)
  const angle = -((game.now % 60_000) / 60_000) * Math.PI * 2
  // c2d.rotate(angle)
  c2d.translate(-cam.w / 2, -cam.h / 2)

  c2d.beginPath()
  c2d.drawImage(img.fog, x, y, img.fog.naturalWidth, img.fog.naturalHeight)

  // c2d.globalCompositeOperation = 'hue'
  // c2d.fillStyle = 'hsl(12deg, 100%, 50%)' // 15 degree hue shift
  // c2d.fillRect(0, 0, img.fog.naturalWidth, img.fog.naturalHeight)
  // c2d.globalCompositeOperation = 'source-over' // Reset composite mode

  // c2d.drawImage(
  //   img.fog,
  //   ratio * img.fog.naturalWidth,
  //   ratio * img.fog.naturalHeight,
  //   img.fog.naturalWidth,
  //   img.fog.naturalHeight,
  //   cam.w / 2 - img.fog.naturalWidth / 2,
  //   cam.h / 2 - img.fog.naturalHeight / 2,
  //   img.fog.naturalWidth,
  //   img.fog.naturalHeight
  // )
  c2d.restore()

  let title
  if (node.type === 'Monster') {
    const {modifier, species, class: clazz} = node.monster
    title = `${modifier.toLowerCase()} ${species.toLowerCase()} ${clazz.toLowerCase()}`
  } else title = node.item.loot.toLowerCase()

  drawText(c2d, title, {
    fill: '#eaeaea',
    justify: 'TopCenter',
    x: Math.trunc(cam.w / 2),
    y: cam.y + spacePx / 2
  })

  switch (node.turn) {
    case 'AI':
      switch (node.phase) {
        case 'Paused':
          console.log(node.monster.hp)
          if (node.monster.hp <= 0) {
            drawText(c2d, 'enemy slain!', {
              // to-do: name.
              fill: '#eaeaea',
              justify: 'Center',
              x: Math.trunc(cam.w / 2),
              y: cam.y + spacePx * 12
            })
          }
          break
        case 'Init':
          break
        case 'Rolling':
          drawText(c2d, 'enemy attacks!', {
            // to-do: name.
            fill: '#eaeaea',
            justify: 'Center',
            x: Math.trunc(cam.w / 2),
            y: cam.y + spacePx * 12
          })
          break
        case 'Rolled':
          drawText(c2d, `${path.dmg}`, {
            fill: '#990000',
            justify: 'Center',
            size: 24,
            x: Math.trunc(cam.w / 2),
            y: cam.y + cam.h - spacePx * 10
          }) // to-do:palette.
          break
        default:
          node satisfies never
      }
      break
    case 'P1':
      switch (node.phase) {
        case 'Paused':
          break
        case 'Init':
          switch (node.type) {
            case 'Loot':
              break
            case 'Monster':
              break
            default:
              node satisfies never
          }
          break
        case 'Rolling':
          drawText(c2d, 'p1 attacks!', {
            // to-do: name.
            fill: '#eaeaea',
            justify: 'Center',
            x: Math.trunc(cam.w / 2),
            y: cam.y + spacePx * 12
          }) // to-do:palette.
          break
        case 'Rolled':
          drawText(c2d, `${path.dmg}`, {
            fill: '#990000',
            justify: 'Center',
            size: 24,
            x: Math.trunc(cam.w / 2),
            y: cam.y + cam.h - spacePx * 10
          }) // to-do:palette.
          break
        default:
          node satisfies never
      }
      break
    default:
      node satisfies never
  }
}

export function pathNodeEntUpdate(path: PathNodeEnt, game: Game): void {
  const node = game.path.nodes[game.path.node]!

  switch (node.turn) {
    case 'AI':
      switch (node.phase) {
        case 'Paused':
          if (!node.updated) node.updated = game.now
          if (game.now - node.updated > pausedMillis) {
            node.updated = game.now
            node.phase = 'Init'
            if (node.monster.hp <= 0) {
              node.updated = game.now
              node.turn = 'P1'
              if (game.path.node === game.path.nodes.length - 1) {
                game.zoo.replace(GameOverLevelEnt(game))
              } else game.path.node++
            }
          }
          break
        case 'Init':
          node.phase = 'Rolling'
          audioPlay(game.audio, game.sound.dice0)
          node.updated = game.now
          break
        case 'Rolling':
          if (game.now - node.updated >= rollMillis) {
            node.phase = 'Rolled'
            node.updated = game.now
            path.dmg = rollDmg(node.monster, game.rnd)
            game.p1.hp -= path.dmg
          }
          // to-do: don't tie UI logic to model.
          else if (game.rnd.num > 0.7) diceRoll(game.dice, game.rnd)
          break
        case 'Rolled':
          if (game.now - node.updated >= rolledMillis) {
            node.updated = game.now
            node.turn = 'P1'
            node.phase = 'Paused'
          }
          break
        default:
          node satisfies never
      }
      break
    case 'P1':
      switch (node.phase) {
        case 'Paused':
          if (game.p1.hp <= 0) {
            game.zoo.replace(GameOverLevelEnt(game))
          } else if (game.p1.hp > 0 || game.now - node.updated > pausedMillis) {
            node.updated = game.now
            node.phase = 'Init'
          }
          break
        case 'Init':
          switch (node.type) {
            case 'Loot':
              break
            case 'Monster':
              if (
                game.ctrl.isOnStart('A') &&
                cursorEntHits(game.cursor, path.belt, game)
              ) {
                node.phase = 'Rolling'
                audioPlay(game.audio, game.sound.dice0)
                node.updated = game.now
              }
              break
            default:
              node satisfies never
          }
          break
        case 'Rolling':
          if (game.now - node.updated >= rollMillis) {
            node.phase = 'Rolled'
            node.updated = game.now
            path.dmg = Math.ceil(game.dice.val * ((game.p1.lvl + 1) * 10))
            node.monster.hp -= path.dmg
          }
          // to-do: don't tie UI logic to model.
          else if (game.rnd.num > 0.7) diceRoll(game.dice, game.rnd)
          break
        case 'Rolled':
          if (game.now - node.updated >= rolledMillis) {
            node.updated = game.now
            node.turn = 'AI'
            node.phase = 'Paused'
          }
          break
        default:
          node satisfies never
      }
      break
    default:
      node satisfies never
  }
}
