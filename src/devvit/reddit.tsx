import {type Context, Devvit, type JobContext} from '@devvit/public-api'
import {Preview} from './preview.tsx'
import {redisPostCreate} from './redis.ts'

Devvit.configure({redditAPI: true})

/** create a new post as the viewer. */
export async function redditCreatePost(
  ctx: Context | JobContext,
  mode: 'UI' | 'NoUI'
): Promise<void> {
  if (!ctx.subredditName) throw Error('no sub name')

  // requires special permission: post as viewer.
  const post = await ctx.reddit.submitPost({
    preview: <Preview />,
    subredditName: ctx.subredditName,
    title: `Subterrane Cave #changeme`
  })

  await redisPostCreate(ctx.redis, post)

  // hack: JobContext has a ui member.
  if (mode === 'UI' && 'ui' in ctx) {
    ctx.ui.showToast({
      appearance: 'success',
      text: `Subterrane Cave #changeme posted.`
    })
    ctx.ui.navigateTo(post)
  }
  console.log(
    `subterrane cave #changeme posted by ${ctx.userId ?? 'subterranegame'}`
  )
}
