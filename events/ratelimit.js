const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

module.exports = {
  name: 'rateLimit',
  async execute (rateLimitData) {
    logger.info(
      `Rate limit reached! Timeout: ${rateLimitData.timeout} Limit: ${rateLimitData.limit}`
    )
  }
}
