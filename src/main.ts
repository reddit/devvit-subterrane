import {
  type Context,
  Devvit,
  type FormKey,
  type FormOnSubmitEvent,
  type JobContext
} from '@devvit/public-api'
import {App} from './devvit/app.tsx'
import {navigateToPost} from './devvit/crap-util.ts'
import {r2CreatePost} from './devvit/r2.tsx'
import {PostRecord} from './devvit/record.ts'
import {
  PostSeed,
  redisQueryP1,
  redisSetPlayer,
  redisSetPost
} from './devvit/redis.ts'

const newPostScheduleJob: string = 'NewPostSchedule'

Devvit.addCustomPostType({name: 'Cave', height: 'regular', render: App})

Devvit.addMenuItem({
  label: 'New Subterrane Cave Post',
  location: 'subreddit',
  onPress: async (_ev, ctx) => createPost(ctx, 'UI')
})

const postScheduleForm: FormKey = Devvit.createForm(
  {
    acceptLabel: 'Save',
    description:
      'Post every x hours (0-23) and y minutes (0-59); zero period to disable.',
    fields: [
      {name: 'hours', label: 'x Hours', required: true, type: 'number'},
      {name: 'mins', label: 'y Minutes', required: true, type: 'number'}
    ],
    title: 'Subterrane Cave Post Schedule'
  },
  onSavePostSchedule
)

async function onSavePostSchedule(
  ev: FormOnSubmitEvent<{readonly hours: number; readonly mins: number}>,
  ctx: Context
): Promise<void> {
  const {hours, mins} = ev.values
  for (const job of await ctx.scheduler.listJobs()) {
    console.log(`canceling cave job ${job.name} (${job.id})`)
    await ctx.scheduler.cancelJob(job.id)
  }

  if (
    hours < 0 ||
    mins < 0 ||
    !Number.isInteger(hours) ||
    !Number.isInteger(mins) ||
    (!hours && !mins)
  ) {
    console.log('unscheduled recurring cave posts')
    ctx.ui.showToast('Unscheduled recurring subterrane cave posts.')
    return
  }

  await ctx.scheduler.runJob({
    name: newPostScheduleJob,
    cron: `*/${mins} */${hours} * * *`
  })
  ctx.ui.showToast(
    `Scheduled recurring subterrane cave posts every ${hours} hour(s) and ${mins} minute(s).`
  )
  console.log(
    `scheduled recurring cave posts every ${hours} hours(s) and ${mins} minute(s)`
  )
}

Devvit.addSchedulerJob<undefined>({
  name: newPostScheduleJob,
  onRun: (_ev, ctx) => createPost(ctx, 'NoUI')
})

Devvit.addMenuItem({
  label: 'Schedule / Cancel Recurring Subterrane Cave Posts',
  location: 'subreddit',
  onPress: (_ev, ctx) => ctx.ui.showForm(postScheduleForm)
})

// to-do: probably better to schema upgrade when viewing a post than on app
// upgrade trigger to avoid having to partition across scheduled jobs? should
// include post.setCustomPostPreview(…).

async function createPost(
  ctx: Context | JobContext,
  mode: 'UI' | 'NoUI'
): Promise<void> {
  const seed = PostSeed()
  const r2Post = await r2CreatePost(ctx, seed)
  const post = PostRecord(r2Post, seed)
  const p1 = await redisQueryP1(ctx)
  p1.discovered.push(post.t3)
  await Promise.all([
    redisSetPost(ctx.redis, post),
    redisSetPlayer(ctx.redis, p1)
  ])
  if (mode === 'UI') navigateToPost(ctx as Context, r2Post, post)
}

export default Devvit
