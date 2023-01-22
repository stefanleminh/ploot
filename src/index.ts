import { Client, Intents, Collection } from 'discord.js'
import fs from 'fs'
import path from 'path'
import { logging } from './logging/winston'
import Keyv from 'keyv'
import { Properties } from './types/properties'
import config from '../config.json'
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
  lastRoundSpectatorIds: new Keyv(),
  currentSpectators: undefined,
  currentPlayers: undefined
}

const eventFiles = fs
  .readdirSync('./src/events')
  .filter((file: string) => file.endsWith('.ts'))
for (const file of eventFiles) {
  const event = require(`./events/${file}`)
  logger.info(`Loaded event ${event.name}`)
  if (event.once) {
    client.once(event.name, (...args: any) => event.execute(client, properties, ...args))
  } else {
    client.on(event.name, (...args: any) => event.execute(...args, client, properties))
  }
}

client.login(properties.config.token)
