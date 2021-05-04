const validation = require('../modules/validation')
const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

module.exports = {
  name: 'endmatch',
  aliases: ['em'],
  execute (message, args, client) {
    if (!validation.isActiveSession(client)) {
      message.channel.send('You have not started a session yet! Please run the =newsession command.')
      return
    }

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
