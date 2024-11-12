import type {AppMessageQueue, NoIDWebViewMessage} from '../../shared/message.ts'
import {Random} from '../../shared/types/random.ts'
import type {GameStateUnknown} from '../game-state.ts'

export class MessageProc {
  /** mutable reference. */
  readonly #state: GameStateUnknown
  #msgID: number = 0

  constructor(state: GameStateUnknown) {
    this.#state = state
  }

  postMessage(msg: NoIDWebViewMessage): void {
    parent.postMessage({...msg, id: this.#msgID}, document.referrer)
  }

  register(op: 'add' | 'remove'): void {
    globalThis[`${op}EventListener` as const](
      'message',
      <EventListenerOrEventListenerObject>this._onMsg
    )
  }

  _onMsg = (
    ev: MessageEvent<
      {type: 'stateUpdate'; data: AppMessageQueue} | {type: undefined}
    >
  ): void => {
    if (ev.data.type !== 'stateUpdate') return // hack: filter unknown messages.

    for (const msg of ev.data.data.q) {
      // hack: filter repeat messages.
      if (msg.id <= this.#msgID) continue
      this.#msgID = msg.id

      if (this.#state.debug || msg.debug)
        console.log(`web view received msg=${JSON.stringify(msg)}`)

      switch (msg.type) {
        case 'Init':
          this.#state.debug = msg.debug
          this.#state.rnd = new Random(msg.seed)
          this.postMessage({type: 'Init'})
          break

        default:
          msg.type satisfies never
      }
    }
  }
}
