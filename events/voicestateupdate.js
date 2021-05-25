const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const validation = require('../modules/validation')

module.exports = {
  name: 'voiceStateUpdate',
  execute (oldState, newState, client) {
    if (!validation.isActiveSession(client)) {
      return
    }
    const newUserChannel = newState.channel
    const oldUserChannel = oldState.channel

    if (oldUserChannel === null && newState.channelID === client.config.lobby) {
      logger.info(`User ${newState.member.user.username} has joined the lobby`)
      if (client.currentPlayers.includes(newState.member.user)) {
        logger.debug('Participant ' + newState.member.user.username + 'already exists in lobby!')
        return
      }
      client.currentPlayers.push(newState.member.user)
      logger.debug('Added participant ' + newState.member.user.username + ' to lobby')
    } else if (newUserChannel === null && oldState.channelID === client.config.lobby) {
      logger.info(`User ${oldState.member.user.username} has left the lobby`)
      client.currentPlayers = client.currentPlayers.filter((player) => player !== oldState.member.user)
      client.currentSpectators = client.currentSpectators.filter((spectator) => spectator !== oldState.member.user)
      logger.debug('Removed participant ' + newState.member.user.username + ' from lobby')
    }
  }
}
