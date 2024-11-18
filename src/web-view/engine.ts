import {type UTCMillis, utcMillisNow} from '../shared/types/time.ts'
import {Assets} from './assets.ts'
import {Cam} from './cam.ts'
import {drawClear} from './draw.ts'
import {CursorEnt} from './ents/cursor-ent.ts'
import {Dice} from './ents/dice.ts'
import {Zoo} from './ents/zoo.ts'
import {type LoadedGame, isGame} from './game.ts'
import {Input} from './input/input.ts'
import {Looper} from './looper.ts'
import {P1} from './p1.ts'
import {Audio} from './types/audio.ts'
import {MessageProc, postMessage} from './types/message-proc.ts'

declare global {
  // hack: fix type.
  interface FontFaceSet {
    add(font: FontFace): FontFaceSet
  }
}

export class Engine {
  static async new(): Promise<Engine> {
    const assets = await Assets()
    return new Engine(assets, await Audio(assets))
  }

  _game: LoadedGame
  #looper: Looper

  private constructor(assets: Assets, audio: Audio) {
    const canvas = document.querySelector('canvas')
    if (!canvas) throw Error('no canvas')
    canvas.style.display = 'none'

    const cam = new Cam()
    cam.minWH = {w: 288, h: 320}
    const ctrl = new Input(cam, canvas)
    ctrl.mapDefault()
    this._game = {
      audio: audio.ctx,
      debug: false,
      cam,
      canvas,
      ctrl,
      cursor: CursorEnt(assets),
      dice: Dice(),
      img: assets.img,
      mail: undefined as unknown as MessageProc,
      now: 0 as UTCMillis,
      sound: audio,
      p1: P1(),
      zoo: new Zoo()
    }
    this._game.mail = new MessageProc(this._game)

    this.#looper = new Looper(
      assets,
      this._game.canvas,
      this._game.cam,
      this._game.ctrl
    )
    this.#looper.onPause = this.#onPause
    this.#looper.onResume = this.#onResume

    document.fonts.add(assets.font)
  }

  async start(): Promise<void> {
    this._game.mail?.register('add') // don't miss init.
    postMessage({type: 'Loaded'})
    this._game.ctrl.register('add')
    this.#looper.register('add')
    this.#looper.loop = this.#onLoop
  }

  #onLoop = (): void => {
    this.#looper.loop = this.#onLoop // vs me telling looper once

    if (
      this._game.ctrl.pointOn && //
      this._game.audio.state !== 'running'
    )
      void this._game.audio.resume() // don't await; this can hang.

    if (this.#looper.draw) {
      this._game.draw = this.#looper.draw // vs me giving looper draw
      this._game.c2d = this.#looper.draw.c2d
    } else {
      delete this._game.draw
      delete this._game.c2d
    }
    this._game.now = utcMillisNow()

    if (!isGame(this._game)) return

    this._game.canvas.style.display = 'block'

    drawClear(this._game.c2d, this._game.cam)

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
