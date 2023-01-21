const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const validation = require('../modules/validation')

module.exports = {
  name: 'voiceStateUpdate',
  async execute (oldState, newState, client) {
    const lobbyVcId = await client.lobbies.get(newState.guild.id)
    const isLobbyUpdate =
      newState.channelId === lobbyVcId || oldState.channelId === lobbyVcId
    if (!isLobbyUpdate || !validation.isActiveSession(client)) {
      return
    }
    const newUserChannel = newState.channel
    const oldUserChannel = oldState.channel

    if (oldUserChannel === null && newState.channelId === lobbyVcId) {
      logger.info(`User ${newState.member.user.username} has joined the lobby`)
    } else if (newUserChannel === null && oldState.channelId === lobbyVcId) {
      if (oldState.member.user.bot) {
        logger.debug(
          'Participant ' +
            newState.member.user.username +
            ' is a bot and will be ignored.'
        )
        return
      }
      logger.info(`User ${oldState.member.user.username} has left the lobby`)

      logger.debug(
        'Removed participant ' + newState.member.user.username + ' from lobby'
      )
    }
  }
}
