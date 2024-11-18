import type {Player, Profile} from './player.ts'
import type {T3} from './tid.ts'
import type {UTCMillis} from './time.ts'

/** a window message from blocks to the web view. */
export type DevvitMessage = {
  /**
   * configure web view lifetime debug mode. this is by request in devvit
   * but that granularity doesn't make sense in the web view.
   */
  debug: boolean
  p1: Player
  /** cave creator. */
  author: Profile
  /** cave creation timestamp. */
  created: UTCMillis
  /** random number seed. */
  seed: number
  /** post / cave ID. */
  t3: T3
  readonly type: 'Init'
}

/** a window message from the web view to devvit. */
export type WebViewMessage =
  | {readonly type: 'EndGame'}
  | {readonly type: 'Loaded'}
  | {readonly type: 'NewGame'}
