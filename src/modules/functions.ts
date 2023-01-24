import Discord, { CommandInteraction, GuildMember, HexColorString, User } from 'discord.js'

export function chunk (arr: User[], chunkSize: number): User[][] {
  const R = []
  for (let i = 0, len = arr.length; i < len; i += chunkSize) {
    R.push(arr.slice(i, i + chunkSize))
  }
  return R
}

export function createEmbed (list: User[], title: string, color: HexColorString, interaction: CommandInteraction): Discord.MessageEmbed {
  const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(color)
    .setAuthor({
      name: `${interaction.guild!.name} 6v6-Event`,
      iconURL: `${interaction.guild!.iconURL()}`
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

export function clearTeamRoles (interaction: Discord.CommandInteraction, firstTeamRoleId: string, secondTeamRoleId: string): Array<Promise<GuildMember>> {
  if (!interaction.guild) return []
  const promises: Array<Promise<GuildMember>> = []
  if (firstTeamRoleId) {
    interaction.guild.roles.cache
      .get(firstTeamRoleId)!
      .members.forEach((member: GuildMember) => {
        promises.push(
          member.roles.remove(
            interaction.guild!.roles.cache.get(firstTeamRoleId)!
          )
        )
      })
  }
  if (secondTeamRoleId) {
    interaction.guild.roles.cache
      .get(secondTeamRoleId)!
      .members.forEach((member: GuildMember) => {
        promises.push(
          member.roles.remove(
            interaction.guild!.roles.cache.get(secondTeamRoleId)!
          )
        )
      })
  }
  return promises
}
