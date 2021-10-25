const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const validation = require('../modules/validation')

module.exports = {
  name: 'voiceStateUpdate',
  execute (oldState, newState, client) {
    const isLobbyUpdate = newState.channelID === client.config.lobby || oldState.channelID === client.config.lobby
    if (!isLobbyUpdate || !validation.isActiveSession(client)) {
      return
    }
    const newUserChannel = newState.channel
    const oldUserChannel = oldState.channel

    if (oldUserChannel === null && newState.channelID === client.config.lobby) {
      logger.info(`User ${newState.member.user.username} has joined the lobby`)
      if (client.currentPlayers.includes(newState.member.user)) {
        logger.debug('Participant ' + newState.member.user.username + ' already exists in lobby!')
        return
      }
      if (newState.member.user.bot) {
        logger.debug('Participant ' + newState.member.user.username + ' is a bot and will not be added.')
        return
      }
      client.currentPlayers.push(newState.member.user)
      client.channels.cache.get(client.config.botChannel).send('Added player <@' + newState.member.id + '> as a player.')
      logger.debug('Added participant ' + newState.member.user.username + ' to lobby')
    } else if (newUserChannel === null && oldState.channelID === client.config.lobby) {
      if (oldState.member.user.bot) {
        logger.debug('Participant ' + newState.member.user.username + ' is a bot and will be ignored.')
        return
      }
      logger.info(`User ${oldState.member.user.username} has left the lobby`)
      client.currentPlayers = client.currentPlayers.filter((player) => player !== oldState.member.user)
      client.currentSpectators = client.currentSpectators.filter((spectator) => spectator !== oldState.member.user)
      client.channels.cache.get(client.config.botChannel).send('Removed player <@' + oldState.member.id + '> from lobby.')
      logger.debug('Removed participant ' + newState.member.user.username + ' from lobby')
    }
  }
}
