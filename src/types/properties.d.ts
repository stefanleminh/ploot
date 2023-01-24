import Collection from 'discord.js'
import { Config } from './config';
export interface Properties {
  currentSpectators: Keyv
  currentPlayers: Keyv
  commands: Collection
  config: Config
  lobbies: Keyv
  firstTeamVcs: Keyv
  secondTeamVcs: Keyv
  spectatorRoleIds: Keyv
  firstTeamRoleIds: Keyv
  secondTeamRoleIds: Keyv
  lastRoundSpectatorIds: Keyv
}
