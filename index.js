const { Client, Intents, Collection } = require('discord.js')
const fs = require('fs')
const path = require('path')
const logger = require('./logging/winston')(path.basename(__filename))
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MEMBERS
  ]
})
const Keyv = require('keyv')

client.config = require('./config.json')
client.lobbies = new Keyv()
client.firstTeamVcs = new Keyv()
client.secondTeamVcs = new Keyv()
client.spectatorRoleIds = new Keyv()
client.firstTeamRoleIds = new Keyv()
client.secondTeamRoleIds = new Keyv()
client.lastRoundSpectators = new Keyv()

client.commands = new Collection()

const eventFiles = fs
  .readdirSync('./events')
  .filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
  const event = require(`./events/${file}`)
  logger.info(`Loaded event ${event.name}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client))
  } else {
    client.on(event.name, (...args) => event.execute(...args, client))
  }
}

client.login(client.config.token)
