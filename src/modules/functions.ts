import { Properties } from '../types/properties'
import Discord, { CommandInteraction, Collection, GuildMember } from 'discord.js'
import path from 'path'
import { logging } from '../logging/winston'

const logger = logging(path.basename(__filename))

export function addParticipant (participant: any, interaction: any, array: any, arrayname: any): void {
  if (array.includes(participant)) {
    logger.debug(
      `Participant ${participant.username}already exists in ${arrayname}!`
    )
    interaction.channel.send(
      `Participant <@${participant.id}> already exists in ${arrayname}!`
    )
    return
  }
  array.push(participant)
  logger.debug(`Added participant ${participant.username} to list ${arrayname}`)
  interaction.channel.send(
    `Added participant <@${participant.id}> to list ${arrayname}`
  )
}

export function chunk (arr: any, chunkSize: number): any[] {
  const R = []
  for (let i = 0, len = arr.length; i < len; i += chunkSize) {
    R.push(arr.slice(i, i + chunkSize))
  }

  return R
}

export function purge (properties: Properties, interaction: CommandInteraction): void {
  const membersInLobby = Array.from(
    (interaction.guild!.channels.cache.get(properties.config.lobby)!.members as Collection<string, GuildMember>).keys()
  )

  const remainingPlayers = properties.currentPlayers.filter((currentPlayer: any) => membersInLobby.includes(currentPlayer.id)
  )
  logger.debug(
    `Remaining Players are: ${remainingPlayers.map((player: GuildMember) => player.user.username).join(',')}`
  )

  const purgedPlayers = properties.currentPlayers.filter(
    (currentPlayer: any) => !membersInLobby.includes(currentPlayer.id)
  )
  logger.debug(
    `Purged Players are: ${purgedPlayers.map((player: GuildMember) => player.user.username).join(',')}`
  )

  properties.currentPlayers = remainingPlayers
  purgedPlayers.forEach(async (removedPlayer: any) => {
    await interaction.channel!.send(
      `Purged <@${removedPlayer.id}> from list of current players!`
    )
  })

  const remainingSpectators = properties.currentSpectators.filter(
    (currentSpectator: any) => membersInLobby.includes(currentSpectator.id)
  )
  logger.debug(
    `Remaining Spectators are: ${remainingSpectators.map((spectator: any) => spectator.username).join(',')}`
  )

  const purgedSpectators = properties.currentSpectators.filter(
    (currentSpectator: any) => !membersInLobby.includes(currentSpectator.id)
  )
  logger.debug(
    `Purged spectators are: ${purgedSpectators.map((spectator: any) => spectator.username).join(',')}`
  )

  properties.currentSpectators = remainingSpectators
  purgedSpectators.forEach(async (removedSpectator: any) => {
    await interaction.channel!.send(
      `Purged <@${removedSpectator.id}> from list of current spectators!`
    )
  })
}

export function createEmbed (list: any, title: any, color: any, interaction: any): Discord.MessageEmbed {
  const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(color)
    .setAuthor({
      name: `${interaction.guild.name} 6v6-Event`,
      iconURL: interaction.guild.iconURL
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

// const clearTeamRoles = (interaction: any, firstTeamRoleId: any, secondTeamRoleId: any) => {
//   const promises: any = []
//   if (firstTeamRoleId) {
//     interaction.guild.roles.cache
//       .get(firstTeamRoleId)
//       .members.forEach((member: any) => {
//         promises.push(
//           member.roles.remove(
//             interaction.guild.roles.cache.get(firstTeamRoleId)
//           )
//         )
//       })
//   }
//   if (secondTeamRoleId) {
//     interaction.guild.roles.cache
//       .get(secondTeamRoleId)
//       .members.forEach((member: any) => {
//         promises.push(
//           member.roles.remove(
//             interaction.guild.roles.cache.get(secondTeamRoleId)
//           )
//         )
//       })
//   }
//   return promises
// }

// exports.clearTeamRoles = clearTeamRoles
export function clearTeamRoles (interaction: Discord.CommandInteraction<Discord.CacheType>, firstTeamRoleId: any, secondTeamRoleId: any): Array<Promise<Discord.GuildMember>> {
  if (!interaction.guild) return []
  const promises: any = []
  if (firstTeamRoleId) {
    interaction.guild.roles.cache
      .get(firstTeamRoleId)!
      .members.forEach((member: any) => {
        promises.push(
          member.roles.remove(
            interaction.guild!.roles.cache.get(firstTeamRoleId)
          )
        )
      })
  }
  if (secondTeamRoleId) {
    interaction.guild.roles.cache
      .get(secondTeamRoleId)!
      .members.forEach((member: any) => {
        promises.push(
          member.roles.remove(
            interaction.guild!.roles.cache.get(secondTeamRoleId)
          )
        )
      })
  }
  return promises
}
