import path from 'path'
import { logging } from '../logging/winston'
const logger = logging(path.basename(__filename))

module.exports = {
  name: 'rateLimit',
  async execute (rateLimitData: any) {
    logger.info(
      `Rate limit reached! Timeout: ${rateLimitData.timeout} Limit: ${rateLimitData.limit}`
    )
  }
}
