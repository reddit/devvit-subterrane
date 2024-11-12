import type {Post, RedisClient} from '@devvit/public-api'
import type {T3} from '../shared/tid.js'
import {randomEndSeed} from '../shared/types/random.js'

/** records are as independent and immutable as possible. */

// to-do: explore a postRedis() API that can be driven by the web view. how to
//        do batching efficiently to avoid many circuit breaks?

export type PostRecord = {
  /** Random seed. */
  seed: number
}

export const redisSchemaVersion: number = 0

/**
 * if mechanics change later, we have a way to keep legacy behavior for old
 * posts or simply disable play on them.
 */
export const gameVersion: number = 0

/** PostRecord by post ID; post look up. */
const postByT3Key: string = 'post_by_t3'

export async function redisPostCreate(
  redis: RedisClient,
  postish: Readonly<Pick<Post, 'id'>>
): Promise<PostRecord> {
  const post: PostRecord = {
    // don't use seeded random to generate the next seed since each user
    // would generate a duplicate.
    seed: Math.trunc(Math.random() * randomEndSeed)
  }
  await Promise.all([
    redis.hSet(postByT3Key, {[postish.id]: JSON.stringify(post)}) // lookup.
  ])
  return post
}

export async function redisPostQuery(
  redis: RedisClient,
  t3: T3
): Promise<PostRecord | undefined> {
  const json = await redis.hGet(postByT3Key, t3)
  if (json) return JSON.parse(json)
}
