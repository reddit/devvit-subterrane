import {paletteBackground, spacePx} from '../../../shared/theme.ts'
import type {Box} from '../../../shared/types/2d.ts'
import {drawText} from '../../draw.ts'
import type {Game, LoadedGame} from '../../game.ts'
import type {Layer} from '../../layer.ts'
import {cursorEntHits} from '../cursor-ent.ts'
import {EID} from '../eid.ts'
import {CaveLevelEnt} from './cave-level-ent.ts'

export type GameOverLevelEnt = Box & {
  readonly eid: EID
  button: Box
  layer: Layer
  readonly type: 'GameOverLevel'
}

const fontSize: number = 18
const nativeFontSize: number = 6

export function GameOverLevelEnt(game: LoadedGame): GameOverLevelEnt {
  const {zoo} = game
  zoo.clear()
  // state.ctrl.allowContextMenu = false
  // state.p1.hp = playerDefaultHP
  // state.p1.score = 0
  // state.p1.x = state.p1.y = 4800
  const buttonW = 128
  return {
    eid: EID(),
    layer: 'Level',
    type: 'GameOverLevel',
    button: {
      x:
        game.cam.x +
        Math.round(game.cam.w / 2 - buttonW / 2) -
        fontSize / nativeFontSize,
      y: game.cam.y + spacePx * 12 + game.img.logo.naturalHeight + spacePx * 3,
      w: buttonW,
      h: 48
    },
    x: game.cam.x,
    y: game.cam.y,
    w: game.cam.minWH.w,
    h: game.cam.minWH.h
  }
}

export function gameOverLevelEntDraw(
  lvl: Readonly<GameOverLevelEnt>,
  game: Readonly<Game>
): void {
  const {c2d, cam} = game

  c2d.save()
  c2d.translate(-game.cam.x, -game.cam.y)

  c2d.fillStyle = '#eaeaea'
  c2d.beginPath()
  c2d.fillRect(cam.x, cam.y, cam.w, cam.h)
  c2d.lineWidth = 2
  c2d.strokeStyle = '#111'
  c2d.fillStyle = '#eaeaea'
  c2d.beginPath()
  c2d.roundRect(
    c2d.lineWidth,
    c2d.lineWidth,
    cam.w - 2 * c2d.lineWidth,
    cam.h - 2 * c2d.lineWidth,
    spacePx
  )
  c2d.stroke()
  c2d.fill()
  c2d.fillStyle = paletteBackground
  c2d.beginPath()
  c2d.roundRect(
    c2d.lineWidth,
    c2d.lineWidth,
    cam.w - 2 * c2d.lineWidth,
    cam.h - 2 * c2d.lineWidth,
    spacePx
  )
  c2d.fill()

  c2d.beginPath()
  c2d.drawImage(
    game.img.logo,
    cam.x + cam.w / 2 - game.img.logo.naturalWidth / 2,
    cam.y + spacePx * 8
  )

  drawText(c2d, game.p1.hp > 0 ? 'cave cleared' : 'game over', {
    x: cam.x + Math.trunc(cam.w / 2),
    y: cam.y + spacePx * 6 + game.img.logo.naturalHeight + spacePx * 4,
    justify: 'TopCenter',
    fill: '#eaeaea',
    size: fontSize
  })

  c2d.beginPath()
  c2d.roundRect(lvl.button.x, lvl.button.y, lvl.button.w, lvl.button.h, spacePx)
  c2d.strokeStyle = '#eaeaea'
  c2d.stroke()
  drawText(c2d, 'new cave', {
    x: cam.x + Math.trunc(cam.w / 2),
    y: cam.y + spacePx * 12.75 + game.img.logo.naturalHeight + spacePx * 4,
    justify: 'TopCenter',
    fill: cursorEntHits(game.cursor, lvl.button, game) ? '#990000' : '#eaeaea',
    size: fontSize
  })

  c2d.restore()

  // c2d.moveTo(0, 0)
  // c2d.lineTo(0, canvas.width)
  // c2d.lineTo(canvas.height, canvas.width)
  // c2d.lineTo(canvas.height, 0)
  // c2d.closePath()
}

export function gameOverLevelEntUpdate(
  lvl: GameOverLevelEnt,
  game: Game
): void {
  const {cam, zoo} = game
  zoo.replace(game.cursor)
  lvl.button.x =
    cam.x + Math.round(cam.w / 2 - lvl.button.w / 2) - fontSize / nativeFontSize
  lvl.button.y =
    cam.y + spacePx * 12 + game.img.logo.naturalHeight + spacePx * 3

  // if (
  //   (state.init && state.p1.t2 !== state.author.t2) ||
  //   state.completed ||
  //   state.p1.hp <= 0
  // ) {
  //   if (state.p1.t2 === state.author.t2 && !state.completed)
  //     // only send game over if player triggered it and we're not revisiting an
  //     // old game.
  //     postMessage({type: 'GameOver', score: state.p1.score, id: state.msgID})
  if (
    game.ctrl.isOnStart('A') &&
    cursorEntHits(game.cursor, lvl.button, game)
  ) {
    game.zoo.remove(lvl)
    game.zoo.replace(CaveLevelEnt(game))
  }
}
