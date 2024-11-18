import {
  type Context,
  Devvit,
  type JobContext,
  type Post
} from '@devvit/public-api'
import {Preview} from './preview.tsx'

Devvit.configure({redditAPI: true})

/** create a new post as the viewer. */
export async function r2CreatePost(
  ctx: Context | JobContext,
  seed: number
): Promise<Post> {
  if (!ctx.subredditName) throw Error('no sub name')

  // requires special permission: post as viewer.
  const post = await ctx.reddit.submitPost({
    preview: <Preview />,
    subredditName: ctx.subredditName,
    title: `Subterrane Cave ${seed.toString(16)}`
  })

  console.log(
    `subterrane cave #changeme posted by ${ctx.userId ?? 'subterranegame'}`
  )

  return post
}
