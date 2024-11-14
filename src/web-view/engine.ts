import {type UTCMillis, utcMillisNow} from '../shared/types/time.ts'
import {Assets} from './assets.ts'
import {Cam} from './cam.ts'
import {CursorEnt} from './ents/cursor-ent.ts'
import {Dice} from './ents/dice.ts'
import {TitleLevelEnt} from './ents/levels/title-level-ent.ts'
import {Zoo} from './ents/zoo.ts'
import {type ConstructedGame, isGame, isLoadedGame} from './game.ts'
import {Input} from './input/input.ts'
import {Looper} from './looper.ts'
import {P1} from './p1.ts'
import {Audio} from './types/audio.ts'
import {MessageProc} from './types/message-proc.ts'

declare global {
  // hack: fix type.
  interface FontFaceSet {
    add(font: FontFace): FontFaceSet
  }
}

export class Engine {
  _game: ConstructedGame
  #looper?: Looper

  constructor() {
    const canvas = document.querySelector('canvas')
    if (!canvas) throw Error('no canvas')

    const cam = new Cam()
    const ctrl = new Input(cam, canvas)
    ctrl.mapDefault()
    this._game = {
      debug: false,
      cam,
      canvas,
      ctrl,
      dice: Dice(),
      now: 0 as UTCMillis,
      p1: P1(),
      zoo: new Zoo()
    }
    this._game.mail = new MessageProc(this._game)
    // this.#state.cam.minWH = {w: 288, h: 256}
    this._game.zoo.replace(TitleLevelEnt(this._game))
  }

  async start(): Promise<void> {
    this._game.mail?.register('add') // don't miss init.

    const assets = await Assets()
    const audio = await Audio(assets)
    document.fonts.add(assets.font)

    this._game.audio = audio.ctx
    this._game.img = assets.img
    this._game.sound = audio
    if (!isLoadedGame(this._game)) throw Error('game not loaded')
    this._game.cursor = CursorEnt(this._game)
    this.#looper = new Looper(
      assets,
      this._game.canvas,
      this._game.cam,
      this._game.ctrl
    )
    this.#looper.onPause = this.#onPause
    this.#looper.onResume = this.#onResume

    this._game.ctrl.register('add')
    this.#looper.register('add')
    this.#looper.loop = this.#onLoop
  }

  #onLoop = (): void => {
    if (!isLoadedGame(this._game)) throw Error('game not loaded')

    this.#looper!.loop = this.#onLoop // vs me telling looper once

    if (
      this._game.ctrl.pointOn && //
      this._game.audio.state !== 'running'
    )
      void this._game.audio.resume() // don't await; this can hang.

    if (this.#looper!.draw) {
      this._game.draw = this.#looper!.draw // vs me giving looper draw
      this._game.c2d = this.#looper!.draw.c2d
    } else {
      delete this._game.draw
      delete this._game.c2d
    }
    this._game.now = utcMillisNow()

    if (!isGame(this._game)) return

    // don't truncate xy to avoid sawtooth movement.
    // cam.x = p1.x - Math.trunc(canvas.width / 2)
    // cam.y = p1.y - Math.trunc(canvas.height / 2)

    this._game.zoo.update(this._game)
    this._game.zoo.draw(this._game)

    this._game.c2d.beginPath()
    this._game.c2d.fillStyle = this._game.draw.checkerboard
    this._game.c2d.fillRect(
      0,
      0,
      this._game.canvas.width,
      this._game.canvas.height
    )
  }

  #onPause = (): void => {
    console.log('paused')
  }

  #onResume = (): void => {
    console.log('resume')
  }
}
