// biome-ignore lint/style/useImportType: Devvit is a functional dependency of JSX.
import {Devvit} from '@devvit/public-api'
import type {JSONValue} from '@devvit/public-api'
import type {DevvitMessage, WebViewMessage} from '../shared/types/message.js'
import {T3, anonSnoovatarURL, anonUsername} from '../shared/types/tid.js'
import {redisPostQuery} from './redis.js'
import {useState2} from './use-state2.js'

export function App(ctx: Devvit.Context): JSX.Element {
  if (!ctx.postId) throw Error('no post ID')
  const t3 = T3(ctx.postId)
  const debug = 'subterrane' in ctx.debug

  const [[username, snoovatarURL]] = useState2(async () => {
    const user = await ctx.reddit.getCurrentUser()
    const url = await user?.getSnoovatarUrl()
    return [user?.username ?? anonUsername, url ?? anonSnoovatarURL]
  })
  const [postRecord] = useState2(() => redisPostQuery(ctx.redis, t3))
  if (!postRecord) throw Error('no post record')
  useState2(() =>
    ctx.ui.webView.postMessage<DevvitMessage>('web-view', {
      type: 'Init',
      debug,
      seed: postRecord.seed
    })
  )

  function onMsg(msg: WebViewMessage): void {
    if (debug)
      console.log(`${username} app received msg=${JSON.stringify(msg)}`)

    switch (msg.type) {
      case 'EndGame':
        break
      case 'NewGame':
        break
      case 'SaveGame':
        break
      case 'StartGame':
        break
      default:
        msg satisfies never
        break
    }
  }

  return (
    <webview
      id='web-view'
      grow
      onMessage={onMsg as (msg: JSONValue) => void}
      url='index.html'
    />
  )
}
