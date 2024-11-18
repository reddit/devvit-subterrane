import {type Context, Devvit, type JobContext} from '@devvit/public-api'
import type {Player} from '../shared/types/player.ts'
import type {T2} from '../shared/types/tid.ts'
import {Preview} from './preview.tsx'
import {PostRecord, redisCreatePost} from './redis.ts'

Devvit.configure({redditAPI: true})

/** create a new post as the viewer. */
export async function r2CreatePost(
  ctx: Context | JobContext,
  author: Readonly<Player> | T2,
  mode: 'UI' | 'NoUI'
): Promise<void> {
  if (!ctx.subredditName) throw Error('no sub name')

  // requires special permission: post as viewer.
  const r2Post = await ctx.reddit.submitPost({
    preview: <Preview />,
    subredditName: ctx.subredditName,
    title: `Subterrane Cave #changeme`
  })

  await redisCreatePost(
    ctx.redis,
    typeof author === 'string' ? undefined : author,
    PostRecord(typeof author === 'string' ? author : author.t2, r2Post.id)
  )

  // hack: JobContext has a ui member.
  if (mode === 'UI' && 'ui' in ctx) {
    ctx.ui.showToast({
      appearance: 'success',
      text: `Subterrane Cave #changeme posted.`
    })
    ctx.ui.navigateTo(r2Post)
  }
  console.log(
    `subterrane cave #changeme posted by ${ctx.userId ?? 'subterranegame'}`
  )
}
