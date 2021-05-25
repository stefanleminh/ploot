const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

module.exports = {
  name: 'remove',
  aliases: ['rm'],
  description: 'Removes one or multiple participants from the session.',
  args: '[@DiscordUser] ...',
  requiresActiveSession: true,
  order: 9,
  execute (message, args, client) {
    if (args.length === 0) {
      message.channel.send('Please provide a name to remove.')
      return
    }
    const participants = message.mentions.users
    participants.forEach((participant) => {
      if (client.currentPlayers.includes(participant)) {
        client.currentPlayers = client.currentPlayers.filter((player) => player !== participant)
        message.channel.send(`Removed participant <@${participant.id}> from the list of current players.`)
        logger.debug(`Removed participant ${participant.username} from the list of current players.`)
      } else if (client.currentSpectators.includes(participant)) {
        client.currentSpectators = client.currentSpectators.filter((spectator) => spectator !== participant)
        message.channel.send(`Removed participant <@${participant.id}> from spectator list.`)
        logger.debug(`Removed participant ${participant.username} from spectator list.`)
      } else {
        message.channel.send(`Participant <@${participant.id}> not found as active player or spectator`)
        logger.debug(`Participant ${participant.username} not found as active player or spectator.`)
      }
    })
  }
}
