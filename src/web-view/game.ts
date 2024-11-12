import {paletteBackground} from '../shared/theme.ts'
import {Random} from '../shared/types/random.ts'
import {type UTCMillis, utcMillisNow} from '../shared/types/time.ts'
import {Assets} from './assets.ts'
import {Cam} from './cam.ts'
import type {Draw} from './draw.ts'
import {Cursor} from './ents/cursor.ts'
import {TitleLevel} from './ents/levels/title-level.ts'
import {Zoo} from './ents/zoo.ts'
import {
  type GameState,
  type GameStateDraw,
  type GameStateUnknown,
  isGameStateDraw
} from './game-state.ts'
import {Input} from './input/input.ts'
import {Looper} from './looper.ts'
import {P1} from './p1.ts'
import {Audio} from './types/audio.ts'
import {MessageProc} from './types/message-proc.ts'

export class Game {
  static async new(): Promise<Game> {
    const assets = await Assets()
    const audio = await Audio(assets)
    return new Game(assets, audio)
  }

  #looper: Looper
  _state: GameState | GameStateUnknown

  constructor(assets: Readonly<Assets>, audio: Readonly<Audio>) {
    const canvas = document.querySelector('canvas')
    if (!canvas) throw Error('no canvas')
    const cam = new Cam()
    const ctrl = new Input(cam, canvas)
    ctrl.mapDefault()
    const state: GameStateUnknown = {
      audio: audio.ctx,
      img: assets.img,
      debug: false,
      cam,
      canvas,
      ctrl,
      now: 0 as UTCMillis,
      p1: P1(),
      sound: audio,
      zoo: new Zoo()
    }
    state.mail = new MessageProc(state)
    this._state = state
    this._state.cursor = Cursor(this._state)
    // this.#state.cam.minWH = {w: 288, h: 256}
    this._state.zoo.replace(TitleLevel(this._state as GameState))
    this.#looper = new Looper(assets, canvas, cam, ctrl)
    this.#looper.onPause = this.#onPause
    this.#looper.onResume = this.#onResume
  }

  start(): void {
    this._state.ctrl.register('add')
    this.#looper.register('add')
    this._state.mail?.register('add')
    this.#looper.loop = this.#onLoop
  }

  #onLoop = (): void => {
    if (
      this._state.ctrl.isOnStart('A') && // this isn't right
      this._state.audio.state !== 'running'
    )
      void this._state.audio.resume() // don't await; this can hang.

    this._state.draw = this.#looper.draw // vs me giving looper draw
    this._state.c2d = this.#looper.draw?.c2d
    if (!isGameStateDraw(this._state)) return
    this._state.now = utcMillisNow()

    // don't truncate xy to avoid sawtooth movement.
    // cam.x = p1.x - Math.trunc(canvas.width / 2)
    // cam.y = p1.y - Math.trunc(canvas.height / 2)

    this._state.zoo.update(this._state)
    this._state.zoo.draw(this._state)

    this.#looper.loop = this.#onLoop // vs me telling looper once
  }

  #onPause = (): void => {
    console.log('paused')
  }

  #onResume = (): void => {
    console.log('resume')
  }
}
