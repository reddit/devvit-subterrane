import {AppMessageQueue} from '../shared/message.js'
import {randomEndSeed} from '../shared/types/random.js'
import {Game} from './game.js'

const game = await Game.new()
game.start()

const noDevvit = location.port === '1234'

console.log('changeme v0.0.0')

if (noDevvit) {
  const delay = Math.random() * 1_000
  const seed = Date.now() % randomEndSeed
  console.log(`delay=${delay} seed=${seed}`)

  setTimeout(
    () =>
      game._state.mail?._onMsg(
        new MessageEvent<{type: 'stateUpdate'; data: AppMessageQueue}>(
          'message',
          {
            data: {
              type: 'stateUpdate',
              data: AppMessageQueue({debug: true, seed, type: 'Init'})
            }
          }
        )
      ),
    delay
  )
}
