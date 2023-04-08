import { type RateLimitData } from 'discord.js'
import path from 'path'
import { logging } from '../logging/winston.js'
import { fileURLToPath } from 'url'
import { type PlootEvent } from 'types/plootevent.js'
// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
const logger = logging(path.basename(__filename))

export const event: PlootEvent = {
  name: 'rateLimit',
  async execute (rateLimitData: RateLimitData) {
    logger.info(
      `Rate limit reached! Timeout: ${rateLimitData.timeout} Limit: ${rateLimitData.limit}`
    )
  }
}
