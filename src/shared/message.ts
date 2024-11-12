/** a window message from the app to the web view. */
export type DevvitMessage = {
  /**
   * hack: every app render posts a message. the ID allows the web view to
   * ignore previously sent messages.
   */
  id: number
} & NoIDDevvitMessage

export type AppMessageQueue = {
  /** the last queued message ID (message may no longer be in queue). */
  id: number
  // hack: useState() doesn't accept readonly arrays.
  q: Readonly<DevvitMessage>[]
}

export function AppMessageQueue(init: InitAppMessage): AppMessageQueue {
  // init to 1 so that webroot can be at 0.
  return {id: 1, q: [{...init, id: 1}]}
}

export type NoIDDevvitMessage = InitAppMessage

/**
 * hack: the web view iframe is loaded immediately but the local runtime is
 * slow. wait until the local runtime is loaded before attempting any state
 * changes that drive messages that might be dropped.
 */
export type InitAppMessage = {
  /**
   * configure web view lifetime debug mode. this is by request in devvit
   * but that granularity doesn't make sense in the web view.
   */
  debug: boolean
  seed: number
  readonly type: 'Init'
}

/** a window message from the web view to the app. */
export type WebViewMessage = {
  /**
   * hack: every app render posts a message. the ID allows the web view to
   * report messages received.
   */
  id: number
} & NoIDWebViewMessage

export type NoIDWebViewMessage =
  | {score: number; readonly type: 'GameOver'}
  | {readonly type: 'Init'}
  | {readonly type: 'Play'}
  | {readonly type: 'NewGame'}
