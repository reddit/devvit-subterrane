export type DevvitMessage = {
  /**
   * configure web view lifetime debug mode. this is by request in devvit
   * but that granularity doesn't make sense in the web view.
   */
  debug: boolean
  /** random number seed. */
  seed: number
  readonly type: 'Init'
}

/** a window message from the web view to the app. */
export type WebViewMessage =
  | {readonly type: 'EndGame'; score: number}
  | {readonly type: 'NewGame'}
  | {readonly type: 'SaveGame'}
  | {readonly type: 'StartGame'}
