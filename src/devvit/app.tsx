// biome-ignore lint/style/useImportType: Devvit is a functional dependency of JSX.
import {Devvit} from '@devvit/public-api'
import type {JSONObject} from '@devvit/public-api'
import {
  AppMessageQueue,
  type DevvitMessage,
  type WebViewMessage
} from '../shared/message.js'
import {T2, T3, anonSnoovatarURL, anonUsername} from '../shared/tid.js'
import {redisPostQuery} from './redis.js'
import {useState2} from './use-state2.js'

export function App(ctx: Devvit.Context): JSX.Element {
  if (!ctx.postId) throw Error('no post ID')
  const t3 = T3(ctx.postId)
  const debug = 'changeme' in ctx.debug

  const [[username, snoovatarURL]] = useState2(async () => {
    const user = await ctx.reddit.getCurrentUser()
    const url = await user?.getSnoovatarUrl()
    return [user?.username ?? anonUsername, url ?? anonSnoovatarURL]
  })
  const [postRecord] = useState2(() => redisPostQuery(ctx.redis, t3))
  if (!postRecord) throw Error('no post record')

  const [msgQueue, setMsgQueue] = useState2(
    AppMessageQueue({debug, seed: postRecord?.seed, type: 'Init'})
  )

  function queueMsg(msg: Readonly<Omit<DevvitMessage, 'id'>>): void {
    setMsgQueue(prev => ({
      id: prev.id + 1,
      q: [...prev.q, {...msg, id: prev.id + 1}]
    }))
  }

  function drainQueue(id: number): void {
    setMsgQueue(prev => ({id: prev.id, q: prev.q.filter(msg => msg.id > id)}))
  }

  async function onMsg(msg: WebViewMessage): Promise<void> {
    if (debug)
      console.log(`${username} app received msg=${JSON.stringify(msg)}`)
    drainQueue(msg.id)

    switch (msg.type) {
      case 'Init':
        break

      default:
        msg satisfies never
        break
    }
  }

  return (
    <webview
      grow
      onMessage={onMsg as (msg: JSONObject) => Promise<void>}
      state={msgQueue}
      url='index.html'
    />
  )
}
