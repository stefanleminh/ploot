import Discord, { type Collection, type Role, type Guild, type GuildMember, type HexColorString, type User } from 'discord.js'
import path from 'path'
import { logging } from '../logging/winston'
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

export function clearTeamRoles (roleCache: Collection<string, Role>, firstTeamRoleId: string, secondTeamRoleId: string): Array<Promise<GuildMember>> {
  const promises: Array<Promise<GuildMember>> = []
  if (firstTeamRoleId) {
    const firstTeamRole = roleCache
      .get(firstTeamRoleId)!
    firstTeamRole
      .members.forEach((member: GuildMember) => {
        logger.info(
          `Removing role ${
            roleCache.get(firstTeamRoleId)!.name
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
    roleCache
      .get(secondTeamRoleId)!
      .members.forEach((member: GuildMember) => {
        logger.info(
          `Removing role ${
            roleCache.get(secondTeamRoleId)!.name
          } from member ${member.user.username}`
        )
        promises.push(
          member.roles.remove(
            roleCache.get(secondTeamRoleId)!
          )
        )
      })
  }
  return promises
}
