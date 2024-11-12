import type {Random} from '../shared/types/random.ts'
import type {UTCMillis} from '../shared/types/time.ts'
import type {Assets} from './assets.ts'
import type {Cam} from './cam.ts'
import type {C2D, Canvas, Draw} from './draw.ts'
import type {Cursor} from './ents/cursor.ts'
import type {Zoo} from './ents/zoo.ts'
import type {DefaultButton, Input} from './input/input.ts'
import type {P1} from './p1.ts'
import type {Audio, AudioBufferByName} from './types/audio.ts'
import type {MessageProc} from './types/message-proc.ts'

export type GameStateUnknown = RequiredGameState & OptionalGameState

type RequiredGameState = Pick<Assets, 'img'> & {
  audio: AudioContext
  cam: Cam
  canvas: Canvas
  ctrl: Input<DefaultButton>
  debug: boolean
  now: UTCMillis
  p1: P1
  sound: AudioBufferByName
  zoo: Zoo
}

type OptionalGameState = {
  c2d?: C2D
  draw?: Omit<Draw, 'c2d'>
  cursor?: Cursor
  mail?: MessageProc
  rnd?: Random
}

export type GameStateDraw = GameStateUnknown & Required<OptionalGameState>

export type GameState = Required<GameStateUnknown>

export function isGameStateDraw(
  state: GameStateUnknown
): state is GameStateDraw {
  return state.c2d != null
}

export function isGameState(state: GameStateUnknown): state is GameState {
  return state.c2d != null && state.rnd != null
}
