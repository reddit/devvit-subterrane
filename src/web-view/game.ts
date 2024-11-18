import type {Random} from '../shared/types/random.ts'
import type {UTCMillis} from '../shared/types/time.ts'
import type {Assets} from './assets.ts'
import type {Cam} from './cam.ts'
import type {C2D, Canvas, Draw} from './draw.ts'
import type {CursorEnt} from './ents/cursor-ent.ts'
import type {Dice} from './ents/dice.ts'
import type {Path} from './ents/path.ts'
import type {Zoo} from './ents/zoo.ts'
import type {DefaultButton, Input} from './input/input.ts'
import type {P1} from './p1.ts'
import type {AudioBufferByName} from './types/audio.ts'
import type {MessageProc} from './types/message-proc.ts'

/** game assets are loaded than LoadedGame is sent and InitGame is received. */

export type LoadedGame = Pick<Assets, 'img'> &
  Partial<Init> &
  Partial<Drawable> & {
    audio: AudioContext
    cam: Cam
    canvas: Canvas
    ctrl: Input<DefaultButton>
    cursor: CursorEnt
    debug: boolean
    dice: Dice
    mail: MessageProc
    now: UTCMillis
    p1: P1
    sound: AudioBufferByName
    zoo: Zoo
  }
export type InitGame = LoadedGame & Init
export type Game = LoadedGame & Init & Drawable

type Init = {path: Path; rnd: Random}

type Drawable = {c2d: C2D; draw: Omit<Draw, 'c2d'>}

export function isInitGame(game: LoadedGame): game is InitGame {
  return game.rnd != null
}

export function isGame(game: LoadedGame): game is Game {
  return isInitGame(game) && game.c2d != null
}
