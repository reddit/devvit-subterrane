import type {DevvitMessage} from '../shared/types/message.js'
import {randomEndSeed} from '../shared/types/random.js'
import {Engine} from './engine.js'

const engine = await new Engine()
await engine.start()

const noDevvit = location.port === '1234'

console.log('subterrane v0.0.0')

if (noDevvit) {
  const delay = Math.random() * 1_000
  const seed = Date.now() % randomEndSeed
  console.log(`delay=${delay} seed=${seed}`)

  setTimeout(
    () =>
      engine._game.mail?._onMsg(
        new MessageEvent<{
          type: 'devvit-message'
          data: {message: DevvitMessage}
        }>('message', {
          data: {
            type: 'devvit-message',
            data: {message: {debug: true, seed, type: 'Init'}}
          }
        })
      ),
    delay
  )
}
