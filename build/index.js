'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const discord_js_1 = require('discord.js')
const fs_1 = __importDefault(require('fs'))
const path_1 = __importDefault(require('path'))
const logger = require('./src/logging/winston')(
  path_1.default.basename(__filename)
)
const client = new discord_js_1.Client({
  intents: [
    discord_js_1.Intents.FLAGS.GUILDS,
    discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES,
    discord_js_1.Intents.FLAGS.GUILD_MEMBERS
  ]
})
const keyv_1 = __importDefault(require('keyv'))
const properties = {
  commands: new discord_js_1.Collection(),
  config: require('./config.json'),
  lobbies: new keyv_1.default(),
  firstTeamVcs: new keyv_1.default(),
  secondTeamVcs: new keyv_1.default(),
  spectatorRoleIds: new keyv_1.default(),
  firstTeamRoleIds: new keyv_1.default(),
  secondTeamRoleIds: new keyv_1.default(),
  lastRoundSpectatorIds: new keyv_1.default(),
  currentSpectators: undefined,
  currentPlayers: undefined
}
const eventFiles = fs_1.default.readdirSync('./src/events')
console.log(eventFiles)
for (const file of eventFiles) {
  const event = require(`./src/events/${file}`)
  logger.info(`Loaded event ${event.name}`)
  if (event.once) {
    client.once(event.name, (...args) =>
      event.execute(...args, client, properties)
    )
  } else {
    client.on(event.name, (...args) =>
      event.execute(...args, client, properties)
    )
  }
}
client.login(properties.config.token)
