import type {DevvitMessage, WebViewMessage} from '../../shared/message.ts'
import {Random} from '../../shared/types/random.ts'
import {Path} from '../ents/path.ts'
import type {ConstructedGame, Game, InitGame} from '../game.ts'

export class MessageProc {
  /** mutable reference. */
  readonly #game: ConstructedGame

  constructor(game: ConstructedGame) {
    this.#game = game
  }

  register(op: 'add' | 'remove'): void {
    globalThis[`${op}EventListener` as const](
      'message',
      <EventListenerOrEventListenerObject>this._onMsg
    )
  }

  _onMsg = (
    ev: MessageEvent<{type?: 'devvit-message'; data: {message: DevvitMessage}}>
  ): void => {
    // hack: filter unknown messages.
    if (ev.data.type !== 'devvit-message') return

    const msg = ev.data.data.message
    if (this.#game.debug || msg.debug)
      console.log(`web view received msg=${JSON.stringify(msg)}`)

    switch (msg.type) {
      case 'Init':
        this.#game.debug = msg.debug
        this.#game.rnd = new Random(msg.seed)
        this.#game.path = Path(this.#game.rnd)
        break

      default:
        msg.type satisfies never
    }
  }
}

export function postMessage(msg: WebViewMessage): void {
  parent.postMessage(msg, document.referrer)
}
