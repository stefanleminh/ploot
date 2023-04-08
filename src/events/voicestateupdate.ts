import { type Client, type VoiceState } from 'discord.js'
import { type Properties } from '../types/properties.js'
import path from 'path'
import { logging } from '../logging/winston.js'
import { fileURLToPath } from 'url'
import { isActiveSession } from '../modules/validation.js'
// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
const logger = logging(path.basename(__filename))

export const event = {
  name: 'voiceStateUpdate',
  async execute (oldState: VoiceState, newState: VoiceState, client: Client, properties: Properties) {
    const lobbyVcId = await properties.lobbies.get(newState.guild.id)
    const isLobbyUpdate =
      newState.channelId === lobbyVcId || oldState.channelId === lobbyVcId
    if (!isLobbyUpdate || !(await isActiveSession(properties, newState.guild.id))) {
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
    }
  }
}
