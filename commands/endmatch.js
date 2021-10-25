const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

module.exports = {
  name: 'endmatch',
  aliases: ['em'],
  description: 'Moves the users back to the lobby. The user has to be in a VC to work.',
  args: '',
  requiresActiveSession: true,
  execute (message, args, client) {
    if (client.voiceChannels[1].members.size > 0) {
      client.voiceChannels[1].members.array().forEach((player) => {
        player.voice.setChannel(client.voiceChannels[0])
        logger.info(`Moved user ${player.user.username} to voice channel ${client.voiceChannels[0].name}`)
      })
    }

    if (client.voiceChannels[2].members.size > 0) {
      client.voiceChannels[2].members.array().forEach((player) => {
        player.voice.setChannel(client.voiceChannels[0])
        logger.info(`Moved user ${player.user.username} to voice channel ${client.voiceChannels[1].name}`)
      })
    }
  }
}
