import { type VoiceState } from 'discord.js'
import { type Properties } from 'src/types/properties'
import path from 'path'
import { logging } from '../logging/winston'
const logger = logging(path.basename(__filename))
const validation = require('../modules/validation')

module.exports = {
  name: 'voiceStateUpdate',
  async execute (oldState: VoiceState, newState: VoiceState, properties: Properties) {
    const lobbyVcId = await properties.lobbies.get(newState.guild.id)
    const isLobbyUpdate =
      newState.channelId === lobbyVcId || oldState.channelId === lobbyVcId
    if (!isLobbyUpdate || !validation.isActiveSession(properties, newState.guild.id)) {
      return
    }
    const newUserChannel = newState.channel
    const oldUserChannel = oldState.channel

    if (oldUserChannel === null && newState.channelId === lobbyVcId) {
      logger.info(`User ${newState.member!.user.username} has joined the lobby`)
    } else if (newUserChannel === null && oldState.channelId === lobbyVcId) {
      if (oldState.member!.user.bot) {
        logger.debug(
          'Participant ' +
            newState.member!.user.username +
            ' is a bot and will be ignored.'
        )
        return
      }
      logger.info(`User ${oldState.member!.user.username} has left the lobby`)

      logger.debug(
        'Removed participant ' + newState.member!.user.username + ' from lobby'
      )
    }
  }
}
