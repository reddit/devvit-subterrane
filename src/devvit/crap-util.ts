import type {Context, Post} from '@devvit/public-api'
import type {PostRecord} from './record.ts'

export function navigateToPost(
  ctx: Context,
  r2Post: Post,
  post: Readonly<PostRecord>
): void {
  ctx.ui.showToast({
    appearance: 'success',
    text: `Subterrane Cave ${post.seed.toString(16)} posted.`
  })
  ctx.ui.navigateTo(r2Post)
}
