const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const Discord = require('discord.js')

// Cooldowns
const cooldowns = new Discord.Collection()

module.exports = {
  name: 'message',
  execute (message, client) {
    if (!message.content.startsWith(client.config.prefix) || message.author.bot) return

    const args = message.content.slice(client.config.prefix.length).split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
    logger.debug(`Received command: ${command.name}`)

    // If command exist
    if (!command) {
      logger.debug(`Command not found: ${command.name}`)
      return
    }

    // Check if command can be executed in DM
    if (command.guildOnly && message.channel.type !== 'text') {
      return message.reply('I can\'t execute that command inside DMs!')
    }

    // Check if args are required
    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`

      if (command.usage) {
        reply += `\nThe proper usage would be: \`${client.config.prefix}${command.name} ${command.usage}\``
      }

      return message.channel.send(reply)
    }

    if (command.requiresActiveSession) {
      return message.reply('You have not started a session yet! Please run the =newsession command.')
    }

    // Check if user is in cooldown
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 3) * 1000

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount

      if (now < expirationTime) {
      // If user is in cooldown
        const timeLeft = (expirationTime - now) / 1000
        return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
      }
    } else {
      timestamps.set(message.author.id, now)
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
      // Execute command
      try {
        logger.info(`Running command: ${command.name} with following args: ${args}`)
        command.execute(message, args, client)
      } catch (error) {
        logger.error(error)
        message.reply('There was an error trying to execute that command!')
      }
    }
  }
}
