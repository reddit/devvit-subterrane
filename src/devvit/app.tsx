// biome-ignore lint/style/useImportType: Devvit is a functional dependency of JSX.
import {Devvit} from '@devvit/public-api'
import type {Context, UseStateResult} from '@devvit/public-api'
import {paletteBlack80} from '../shared/theme.js'
import type {DevvitMessage, WebViewMessage} from '../shared/types/message.js'
import {Player} from '../shared/types/player.js'
import {T2, T3, anonSnoovatarURL, anonUsername} from '../shared/types/tid.js'
import {r2CreatePost} from './r2.js'
import {
  PlayRecord,
  type PostRecord,
  T3T2,
  redisCreatePlay,
  redisQueryPlay,
  redisQueryPlayer,
  redisQueryPost,
  redisSetPlayer
} from './redis.js'
import {useState2} from './use-state2.js'

export function App(ctx: Devvit.Context): JSX.Element {
  const debug = 'subterrane' in ctx.debug

  if (!ctx.postId) throw Error('no T2')
  const [post] = useState2(redisQueryPost(ctx.redis, T3(ctx.postId)))
  if (!post) throw Error('no post record')

  // PlayerRecord is a irreconcilable save slot. defer loading to decrease the
  // chance of overwriting another session.
  let [p1, setP1] = useState2<Player | undefined>(undefined)

  if (!ctx.userId) throw Error('no T2')
  const t2 = T2(ctx.userId)
  const [play, setPlay] = useState2(
    redisQueryPlay(ctx.redis, T3T2(post.t3, t2))
  )

  const [launch, setLaunch] = useState2(false)
  const [clicked, setClicked] = useState2(false)
  if (launch) {
    return (
      // hack: avoid fouc.
      <vstack
        width='100%'
        height='100%'
        alignment='middle center'
        backgroundColor={paletteBlack80}
      >
        {/* to-do: migrate to no-ID postMessage(). */}
        <webview
          id='web-view'
          onMessage={msg =>
            onMsg(
              ctx,
              debug,
              [p1, setP1],
              [play, setPlay],
              post,
              msg as WebViewMessage
            )
          }
          url='index.html'
          width='100%'
          height='100%'
        />
      </vstack>
    )
  }

  return (
    <vstack
      width='100%'
      height='100%'
      alignment='top center'
      backgroundColor={paletteBlack80}
      gap='large'
      padding='large'
    >
      {/* hack: blocks doesn't support webp translucency. */}
      <image
        url='logo.png'
        imageWidth='452px'
        imageHeight='62px'
        resizeMode='fit'
        width='100%'
      />
      <vstack
        width='100%'
        alignment='middle center'
        backgroundColor={paletteBlack80}
        gap='large'
        padding='large'
      >
        {/* biome-ignore lint/a11y/useButtonType: */}
        <button
          appearance='primary'
          disabled={clicked}
          size='large'
          minWidth='160px'
          icon={play == null ? 'play-fill' : 'new-fill'}
          onPress={async () => {
            setClicked(true)
            if (clicked) return // hack: disabled isn't fast enough.
            if (play == null) setLaunch(true)
            else {
              if (!p1) p1 = await P1(ctx)
              p1.cavesFound++
              setP1(p1)
              // to-do: add loading state.
              await r2CreatePost(ctx, p1, 'UI')
            }
          }}
        >
          {play == null ? 'play' : 'new game'}
        </button>
      </vstack>
    </vstack>
  )
}

async function onMsg(
  ctx: Context,
  debug: boolean,
  [p1, setP1]: UseStateResult<Player | undefined>,
  [play, setPlay]: UseStateResult<PlayRecord | undefined>,
  post: PostRecord,
  msg: WebViewMessage
): Promise<void> {
  if (debug)
    console.log(
      `${p1?.username ?? anonUsername} app received msg=${JSON.stringify(msg)}`
    )

  switch (msg.type) {
    case 'Loaded': {
      // hack: state setter isn't working.
      p1 = await P1(ctx)
      p1.cavesEntered++
      setP1(p1)
      play = PlayRecord(p1.t2, post.t3)
      setPlay(play)
      await redisCreatePlay(ctx.redis, p1, play)
      const author = await ctx.reddit.getUserById(post.author)
      // to-do: migrate to no-ID postMessage().
      ctx.ui.webView.postMessage<DevvitMessage>('web-view', {
        type: 'Init',
        created: post.created,
        debug,
        author: {
          snoovatarURL: (await author?.getSnoovatarUrl()) ?? anonSnoovatarURL,
          t2: post.author,
          username: author?.username ?? anonUsername
        },
        seed: post.seed,
        p1,
        t3: post.t3
      })
      break
    }
    case 'EndGame':
      if (!p1) throw Error('no P1')
      // to-do: exit web view for perf.
      await redisSetPlayer(ctx.redis, p1)
      break
    case 'NewGame':
      if (!p1) throw Error('no P1')
      p1.cavesFound++
      setP1(p1)
      // to-do: exit web view for perf.
      // to-do: notify in game UI too and disable button.
      await r2CreatePost(ctx, p1, 'UI')
      break
    default:
      msg satisfies never
      break
  }
}

async function P1(ctx: Context): Promise<Player> {
  if (!ctx.userId) throw Error('no T2')
  const t2 = T2(ctx.userId)
  let p1 = await redisQueryPlayer(ctx.redis, t2)
  if (!p1) {
    const user = await ctx.reddit.getCurrentUser()
    // hack: why can't this be propulated in User?
    const snoovatarURL = (await user?.getSnoovatarUrl()) ?? anonSnoovatarURL
    p1 = Player({snoovatarURL, t2, username: user?.username ?? anonUsername})
    await redisSetPlayer(ctx.redis, p1)
  }
  return p1
}
