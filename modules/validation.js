const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

const isActiveSession = client => {
  const isActiveSession =
    client.spectatorRoleId !== '' &&
    client.firstTeamRoleId !== '' &&
    client.secondTeamRoleId !== ''
  logger.debug(`Current session is active: [${isActiveSession}]`)
  return isActiveSession
}
exports.isActiveSession = isActiveSession
