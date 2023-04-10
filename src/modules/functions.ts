import Discord, { type Collection, type Role, type Guild, type GuildMember, type HexColorString, type User, type MessageEmbed } from 'discord.js'
import path from 'path'
import { logging } from '../logging/winston.js'
import { fileURLToPath } from 'url'
// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
const logger = logging(path.basename(__filename))
export function chunk (arr: User[], chunkSize: number): User[][] {
  const R = []
  for (let i = 0, len = arr.length; i < len; i += chunkSize) {
    R.push(arr.slice(i, i + chunkSize))
  }
  return R
}

export function createEmbed (list: User[], title: string, color: HexColorString, guild: Guild): Discord.MessageEmbed {
  const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(color)
    .setAuthor({
      name: `${guild.name} 6v6-Event`,
      iconURL: `${guild.iconURL()}`
    })
    .addFields(
      chunk(list, 6).map(chunk => {
        return {
          name: title,
          value: chunk.toString().replace(/,/g, '\n'),
          inline: true
        }
      })
    )
  return embed
}

export function createTeamEmbeds (lobbyVcMembers: Collection<string, GuildMember>, firstTeamRoleId: any, secondTeamRoleId: any, spectatorRoleId: any, guild: Guild, firstTeamVcId: any, secondTeamVcId: any, lobbyVcId: any): MessageEmbed[] {
  const firstTeam: User[] = lobbyVcMembers
    .filter((member: GuildMember) => member.roles.cache.some((role: Role) => role.id === firstTeamRoleId))
    .map((guildmember: GuildMember) => guildmember.user)

  logger.debug(
    'First team is: ' + firstTeam.map((player: User) => player.username).join(', ')
  )

  const secondTeam: User[] = lobbyVcMembers
    .filter((member: GuildMember) => member.roles.cache.some((role: Role) => role.id === secondTeamRoleId))
    .map((guildmember: GuildMember) => guildmember.user)

  logger.debug(
    'Second team is: ' + secondTeam.map((player: User) => player.username).join(', ')
  )

  const spectatorTeam = lobbyVcMembers.filter(
    (member: GuildMember) => member.roles.cache.every(
      (role: Role) => role.id === spectatorRoleId ||
        (role.id !== firstTeamRoleId && role.id !== secondTeamRoleId)
    ) && !member.user.bot
  )
    .map((guildmember: GuildMember) => guildmember.user)

  logger.debug(
    'Spectators are: ' +
    spectatorTeam.map((player: User) => player.username).join(', ')
  )

  const embeds = [
    createEmbed(
      firstTeam,
      guild.channels.cache.get(firstTeamVcId)!.name,
      '#000088',
      guild
    ),
    createEmbed(
      secondTeam,
      guild.channels.cache.get(secondTeamVcId)!.name,
      '#fe0000',
      guild
    ),
    createEmbed(
      spectatorTeam,
      guild.channels.cache.get(lobbyVcId)!.name,
      '#ffa500',
      guild
    )
  ]
  return embeds
}

export function clearTeamRoles (roles: Collection<string, Role>, firstTeamRoleId: string, secondTeamRoleId: string): Array<Promise<GuildMember>> {
  const promises: Array<Promise<GuildMember>> = []
  if (firstTeamRoleId) {
    const firstTeamRole = roles
      .get(firstTeamRoleId)!
    firstTeamRole
      .members.forEach((member: GuildMember) => {
        logger.info(
          `Removing role ${
            roles.get(firstTeamRoleId)!.name
          } from member ${member.user.username}`
        )
        promises.push(
          member.roles.remove(
            firstTeamRole
          )
        )
      })
  }
  if (secondTeamRoleId) {
    roles
      .get(secondTeamRoleId)!
      .members.forEach((member: GuildMember) => {
        logger.info(
          `Removing role ${
            roles.get(secondTeamRoleId)!.name
          } from member ${member.user.username}`
        )
        promises.push(
          member.roles.remove(
            roles.get(secondTeamRoleId)!
          )
        )
      })
  }
  return promises
}
