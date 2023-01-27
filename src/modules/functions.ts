import Discord, { type Guild, type GuildMember, type HexColorString, type User } from 'discord.js'

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

export function clearTeamRoles (guild: Guild, firstTeamRoleId: string, secondTeamRoleId: string): Array<Promise<GuildMember>> {
  const promises: Array<Promise<GuildMember>> = []
  if (firstTeamRoleId) {
    const firstTeamRole = guild.roles.cache
      .get(firstTeamRoleId)!
    firstTeamRole
      .members.forEach((member: GuildMember) => {
        promises.push(
          member.roles.remove(
            firstTeamRole
          )
        )
      })
  }
  if (secondTeamRoleId) {
    guild.roles.cache
      .get(secondTeamRoleId)!
      .members.forEach((member: GuildMember) => {
        promises.push(
          member.roles.remove(
            guild.roles.cache.get(secondTeamRoleId)!
          )
        )
      })
  }
  console.log({ promises })
  return promises
}
