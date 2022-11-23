import path from 'path'
const log = require('../logging/winston')(path.basename(__filename))

module.exports = {
  name: 'rateLimit',
  async execute (rateLimitData: any) {
    log.info(
      `Rate limit reached! Timeout: ${rateLimitData.timeout} Limit: ${rateLimitData.limit}`
    )
  }
}
