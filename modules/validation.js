const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

const isActiveSession = async (client, guildId) => {
  const isActiveSession =
    (await client.spectatorRoleIds.get(guildId)) !== undefined &&
    (await client.firstTeamRoleIds.get(guildId)) !== undefined &&
    (await client.secondTeamRoleIds.get(guildId)) !== undefined
  logger.debug(
    `Current session for Guild ${guildId} is active: [${isActiveSession}]`
  )
  return isActiveSession
}
exports.isActiveSession = isActiveSession

const isConfigured = async (client, guildId) => {
  const isConfigured =
    (await client.lobbies.get(guildId)) !== undefined &&
    (await client.firstTeamVcs.get(guildId)) !== undefined &&
    (await client.secondTeamVcs.get(guildId)) !== undefined
  logger.debug(
    `Current session for Guild ${guildId} is configured: [${isConfigured}]`
  )
  return isConfigured
}
exports.isConfigured = isConfigured
