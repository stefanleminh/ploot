const validation = require('../modules/validation')
const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

module.exports = {
  name: 'switchmode',
  aliases: ['smo'],
  execute (message, args, client) {
    if (!validation.isActiveSession(client)) {
      message.channel.send('You have not started a session yet! Please run the =newsession command.')
      return
    }
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
