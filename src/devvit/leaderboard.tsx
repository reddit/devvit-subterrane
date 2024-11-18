import {Devvit} from '@devvit/public-api'
import type {Context} from '@devvit/public-api'
import type {PlayerRecord} from './record.ts'
import {redisQueryLeaderboard, redisQueryPlayer} from './redis.ts'
import {useState2} from './use-state2.ts'

export type LeaderboardProps = {onBack(): void}

const postHeightPx: number = 320
const rowHeightPx: number = 48
const marginPx: number = 64
const pageSize: number = Math.floor((postHeightPx - marginPx) / rowHeightPx)
const batchSize: number = pageSize * 10

export function Leaderboard(
  props: Readonly<LeaderboardProps>,
  ctx: Context
): JSX.Element {
  const [index, setIndex] = useState2(0)
  const [t2s] = useState2(redisQueryLeaderboard(ctx.redis))
  const [players, setPlayers] = useState2(async () => {
    const batch = []
    for (let i = 0; i < batchSize && i < t2s.length; i++) {
      const player = await redisQueryPlayer(ctx.redis, t2s[i]!)
      if (player) batch.push(player)
    }
    return batch
  })

  return (
    <vstack width='100%' height='100%'>
      <hstack alignment='middle' gap='medium' width='100%'>
        {/* biome-ignore lint/a11y/useButtonType: */}
        <button onPress={props.onBack} icon='back-fill'>
          back
        </button>
        <text style='heading' size='large'>
          Leaderboard
        </text>
      </hstack>
      <Table players={players} index={index} />
      <hstack gap='large' alignment='center' width='100%'>
        {/* biome-ignore lint/a11y/useButtonType: */}
        <button
          appearance='bordered'
          onPress={() => setIndex(prev => Math.max(0, prev - pageSize))}
          icon='left-fill'
        >
          previous
        </button>
        {/* biome-ignore lint/a11y/useButtonType: */}
        <button
          appearance='bordered'
          onPress={async () => {
            if (players.length < index + pageSize) {
              const batch: PlayerRecord[] = []
              for (
                let i = players.length;
                i < players.length + batchSize && i < t2s.length;
                i++
              ) {
                const player = await redisQueryPlayer(ctx.redis, t2s[i]!)
                if (player) batch.push(player)
              }
              setPlayers(prev => [...prev, ...batch])
            }
            setIndex(prev => Math.min(players.length - 1, prev - pageSize))
          }}
          icon='right-fill'
        >
          next
        </button>
      </hstack>
    </vstack>
  )
}

function Table(props: {
  index: number
  players: readonly Readonly<PlayerRecord>[]
}): JSX.Element {
  const rows = []
  for (
    let i = props.index;
    i < props.index + pageSize && i < props.players.length;
    i++
  ) {
    const player = props.players[i]!
    // to-do: use levels not xp. what's the formula?
    rows.push(
      <Row
        name={player.username}
        snoovatarURL={player.snoovatarURL}
        journey={player.journey.length}
        discovered={player.discovered.length}
        lvl={player.xp}
        style={i & 1 ? 'Odd' : 'Even'}
      />
    )
  }
  return (
    <vstack width='100%' grow>
      <Row
        name='name'
        lvl='level'
        journey='caves explored'
        discovered='caves discovered'
        style='Heading'
        snoovatarURL=''
      />
      {rows}
    </vstack>
  )
}

function Row(props: {
  name: string
  lvl: number | string
  snoovatarURL: string
  style: 'Heading' | 'Even' | 'Odd'
  discovered: number | string
  journey: number | string
}): JSX.Element {
  const weight = props.style === 'Heading' ? 'bold' : 'regular'
  const style = props.style === 'Heading' ? 'heading' : 'body'
  return (
    <hstack
      alignment='middle'
      backgroundColor={
        props.style === 'Odd'
          ? 'neutral-background-selected'
          : 'neutral-background-strong'
      }
      width='100%'
      height='48px'
    >
      <spacer size='xsmall' />
      <hstack alignment='middle' width={100 / 2}>
        {props.snoovatarURL ? (
          <image
            url={props.snoovatarURL}
            imageWidth='48px'
            imageHeight='48px'
            description='snoovatar'
          />
        ) : null}
        <text weight='bold' style={style}>
          {props.name}
        </text>
      </hstack>
      <spacer grow />
      <text weight={weight} style={style} width={100 / 6}>
        {props.journey}
      </text>
      <spacer grow />
      <text weight={weight} style={style} width={100 / 6}>
        {props.discovered}
      </text>
      <spacer grow />
      <text weight='bold' style={style} width={100 / 6}>
        {props.lvl}
      </text>
      <spacer size='xsmall' />
    </hstack>
  )
}
