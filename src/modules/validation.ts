import { type Properties } from '../types/properties'

import path from 'path'
import { logging } from '../logging/winston'
const logger = logging(path.basename(__filename))

export async function isConfigured (properties: Properties, guildId: string): Promise<boolean> {
  const isConfigured =
    (await properties.lobbies.get(guildId)) !== undefined &&
    (await properties.firstTeamVcs.get(guildId)) !== undefined &&
    (await properties.secondTeamVcs.get(guildId)) !== undefined
  logger.debug(
    `Current session for Guild ${guildId} is configured: [${isConfigured}]`
  )
  return isConfigured
}

export async function isActiveSession (properties: Properties, guildId: string): Promise<boolean> {
  const isActiveSession =
    (await properties.spectatorRoleIds.get(guildId)) !== undefined &&
    (await properties.firstTeamRoleIds.get(guildId)) !== undefined &&
    (await properties.secondTeamRoleIds.get(guildId)) !== undefined
  logger.debug(
    `Current session for Guild ${guildId} is active: [${isActiveSession}]`
  )
  return isActiveSession
}
