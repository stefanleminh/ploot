const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

module.exports = {
  name: 'switchmode',
  aliases: ['smo'],
  description: 'Switches the player form active player to spectator or vise versa.',
  args: '[@DiscordUser]',
  requiresActiveSession: true,
  order: 10,
  execute (message, args, client) {
    // Switch mode of Player
    if (args.length === 0) {
      message.channel.send('Please provide a name to add.')
      return
    }
    const participant = message.mentions.users.first()

    if (client.currentPlayers.includes(participant)) {
      client.currentSpectators.push(participant)
      client.currentPlayers = client.currentPlayers.filter((element) => element !== participant)
      logger.info(`User ${participant.username} is now a spectator`)
      message.channel.send(`<@${participant.id}> is now spectator.`)
    } else if (client.currentSpectators.includes(participant)) {
      client.currentPlayers.push(participant)
      client.currentSpectators = client.currentSpectators.filter((element) => element !== participant)
      logger.info(`User ${participant.username} is now an active player`)
      message.channel.send(`<@${participant.id}> is now an active player.`)
    } else {
      logger.info(`User ${participant.username} not found as an active player or spectator`)
      message.channel.send(`Participant <@${participant.id}> not found as active player or spectator.`)
    }
  }
}
