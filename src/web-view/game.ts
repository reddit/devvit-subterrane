import type {Random} from '../shared/types/random.ts'
import type {UTCMillis} from '../shared/types/time.ts'
import type {Assets} from './assets.ts'
import type {Cam} from './cam.ts'
import type {C2D, Canvas, Draw} from './draw.ts'
import type {CursorEnt} from './ents/cursor-ent.ts'
import type {Path} from './ents/path.ts'
import type {Zoo} from './ents/zoo.ts'
import type {DefaultButton, Input} from './input/input.ts'
import type {P1} from './p1.ts'
import type {AudioBufferByName} from './types/audio.ts'
import type {MessageProc} from './types/message-proc.ts'

export type ConstructedGame = {
  cam: Cam
  canvas: Canvas
  ctrl: Input<DefaultButton>
  debug: boolean
  now: UTCMillis
  p1: P1
  zoo: Zoo
} & Partial<Loaded> &
  Partial<Init> &
  Partial<Drawable> & {draw?: Omit<Draw, 'c2d'> | undefined}
export type LoadedGame = ConstructedGame & Loaded
export type InitGame = ConstructedGame & Init
export type Game = ConstructedGame & Loaded & Init & Drawable

type Loaded = Pick<Assets, 'img'> & {
  audio: AudioContext
  cursor: CursorEnt
  mail: MessageProc
  sound: AudioBufferByName
}

type Init = {path: Path; rnd: Random}

type Drawable = {c2d: C2D; draw: Omit<Draw, 'c2d'>}

export function isLoadedGame(game: ConstructedGame): game is LoadedGame {
  return game.img != null
}

export function isInitGame(game: ConstructedGame): game is InitGame {
  return game.rnd != null
}

export function isGame(game: ConstructedGame): game is Game {
  return isLoadedGame(game) && isInitGame(game) && game.c2d != null
}
