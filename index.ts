import { Client, Intents, Collection } from'discord.js'
import fs from 'fs'
import path from 'path'
const logger = require('./src/logging/winston')(path.basename(__filename))
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MEMBERS
  ]
})
import Keyv from 'keyv'
import { Properties } from './src/types/properties';
const properties: Properties = {
  commands: require('./config.json'),
  config: new Keyv(),
  lobbies: new Keyv(),
  firstTeamVcs: new Keyv(),
  secondTeamVcs: new Keyv(),
  spectatorRoleIds: new Keyv(),
  firstTeamRoleIds: new Keyv(),
  secondTeamRoleIds: new Keyv(),
  lastRoundSpectatorIds: new Collection(),
  currentSpectators: undefined,
  currentPlayers: undefined
};


const eventFiles = fs
  .readdirSync('./src/events')
  .filter((file: string) => file.endsWith('.js'))

for (const file of eventFiles) {
  const event = require(`./src/events/${file}`)
  logger.info(`Loaded event ${event.name}`)
  if (event.once) {
    client.once(event.name, (...args: any) => event.execute(...args, client, properties))
  } else {
    client.on(event.name, (...args: any) => event.execute(...args, client, properties))
  }
}

client.login(properties.config.token)
