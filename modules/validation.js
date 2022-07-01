const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

const isActiveSession = async (client, guildId) => {
  const isActiveSession =
    (await client.spectatorRoleIds.get(guildId)) !== undefined &&
    (await client.firstTeamRoleIds.get(guildId)) !== undefined &&
    (await client.secondTeamRoleIds.get(guildId)) !== undefined
  logger.debug(`Current session is active: [${isActiveSession}]`)
  return isActiveSession
}
exports.isActiveSession = isActiveSession
