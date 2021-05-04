const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

const isActiveSession = (client) => {
  const isActiveSession = client.voiceChannels.length === 3
  logger.debug('Current session is active: [' + isActiveSession + ']')
  return isActiveSession
}
exports.isActiveSession = isActiveSession
