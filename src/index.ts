import { Client, Intents, Collection } from 'discord.js'
import fs from 'fs'
import path, { dirname } from 'path'
import { logging } from './logging/winston.js'
import Keyv from 'keyv'
import { type Properties } from './types/properties.js'
import config from '../config.json' assert { type: 'json' }
import { fileURLToPath } from 'url'
// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(fileURLToPath(new URL('.', import.meta.url)))
const logger = logging(path.basename(__filename))
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MEMBERS
  ]
})

const properties: Properties = {
  commands: new Collection(),
  config,
  lobbies: new Keyv(),
  firstTeamVcs: new Keyv(),
  secondTeamVcs: new Keyv(),
  spectatorRoleIds: new Keyv(),
  firstTeamRoleIds: new Keyv(),
  secondTeamRoleIds: new Keyv(),
  guaranteedPlayersNextRoundIds: new Keyv(),
  currentSpectators: new Keyv(),
  currentPlayers: new Keyv()
}

const eventFiles = fs
  .readdirSync(__dirname + '/src/events')
  .filter((file: any) => file.endsWith('.ts') || file.endsWith('.js'))

for (const file of eventFiles) {
  const script = `./events/${file}`
  const { event } = await import(script)
  logger.info(`Loaded event ${event.name}`)
  if (event.once) {
    client.once(event.name, (...args: any) => event.execute(client, properties, ...args))
  } else {
    client.on(event.name, (...args: any) => event.execute(...args, client, properties))
  }
}

client.login(properties.config.token).then(() => {
  logger.info('Logged in!')
}).catch(err => {
  logger.error(`Could not log in due to error: ${err}`)
})
