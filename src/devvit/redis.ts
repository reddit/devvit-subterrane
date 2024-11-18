import {Devvit, type RedisClient} from '@devvit/public-api'
import type {Player} from '../shared/types/player.js'
import {randomEndSeed} from '../shared/types/random.js'
import type {T2, T3} from '../shared/types/tid.js'
import {type UTCMillis, utcMillisNow} from '../shared/types/time.js'

export type PlayerRecord = Player

/**
 * cave play record for a player. recorded when a playthrough has actually been
 * started, not when a post has been created, and updated when finished.
 */
export type PlayRecord = {
  /** creation timestamp. */
  created: UTCMillis
  t2: T2
  t3: T3
}

export type PostRecord = {
  /** original poster. */
  author: T2
  /** post creation timestamp. */
  created: UTCMillis
  /** Random seed. */
  seed: number
  /** post ID. */
  t3: T3
}

/** play ID. each player is allowed one play per post. */
export type T3T2 = `${T3}:${T2}`

/** player, post, and play look up. */

/** PlayerRecord by user ID; player look up. */
const playerByT2Key: string = 'player_by_t2'

/** PostRecord by post ID; post look up. */
const postByT3Key: string = 'post_by_t3'

/** PlayRecord by T3T2; play look up. */
const playByT3T2Key: string = 'play_by_t3_t2'

/** player leaderboard across sub. */

/** user IDs ordered by xp; player leaderboard. */
const t2XPZKey: string = 't2_xp_z'

Devvit.configure({redis: true})

export function PlayRecord(t2: T2, t3: T3): PlayRecord {
  return {created: utcMillisNow(), t2, t3}
}

export function PostRecord(t2: T2, t3: T3): PostRecord {
  return {
    author: t2,
    created: utcMillisNow(),
    t3,
    // don't use seeded random to generate the next seed since users would
    // likely generate duplicates.
    seed: Math.trunc(Math.random() * randomEndSeed)
  }
}

export function T3T2(t3: T3, t2: T2): T3T2 {
  return `${t3}:${t2}`
}

export async function redisCreatePost(
  redis: RedisClient,
  p1: Readonly<PlayerRecord> | undefined,
  post: Readonly<PostRecord>
): Promise<void> {
  await Promise.all([
    p1 && redis.hSet(playerByT2Key, {[p1.t2]: JSON.stringify(p1)}),
    redis.hSet(postByT3Key, {[post.t3]: JSON.stringify(post)}) // lookup.
  ])
}

export async function redisQueryPost(
  redis: RedisClient,
  t3: T3
): Promise<PostRecord | undefined> {
  const json = await redis.hGet(postByT3Key, t3)
  if (json) return JSON.parse(json)
}

export async function redisQueryPlayer(
  redis: RedisClient,
  t2: T2
): Promise<PlayerRecord | undefined> {
  const json = await redis.hGet(playerByT2Key, t2)
  if (json) return JSON.parse(json)
}

export async function redisSetPlayer(
  redis: RedisClient,
  player: Readonly<PlayerRecord>
): Promise<void> {
  await Promise.all([
    redis.hSet(playerByT2Key, {[player.t2]: JSON.stringify(player)}),
    redis.zAdd(t2XPZKey, {member: player.t2, score: player.xp})
  ])
}

export async function redisCreatePlay(
  redis: RedisClient,
  player: Readonly<PlayerRecord>,
  play: Readonly<PlayRecord>
): Promise<void> {
  const t3t2 = T3T2(play.t3, player.t2)
  await Promise.all([
    redis.hSet(playByT3T2Key, {[t3t2]: JSON.stringify(play)}), // lookup.
    redis.hSet(playerByT2Key, {[player.t2]: JSON.stringify(player)})
  ])
}

export async function redisQueryPlay(
  redis: RedisClient,
  t3t2: T3T2
): Promise<PlayRecord | undefined> {
  const json = await redis.hGet(playByT3T2Key, t3t2)
  if (json) return JSON.parse(json)
}
