const Discord = require('discord.js')
const config = require('./config.json')
const fs = require('fs')
const path = require('path')

const logger = require('./logging/winston')(path.basename(__filename))
const client = new Discord.Client()
client.config = require('./config.json')
client.currentPlayers = []
client.currentSpectators = []
client.voiceChannels = []
client.firstTeam = []
client.secondTeam = []
client.spectatorTeam = []
client.lastRoundSpectators = []

client.commands = new Discord.Collection()

// Take commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const command = require('./commands/' + file)
  client.commands.set(command.name, command)
  logger.info(`Loaded command ${command.name}`)
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
  const event = require(`./events/${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client))
  } else {
    client.on(event.name, (...args) => event.execute(...args, client))
  }
}

client.login(config.token)
