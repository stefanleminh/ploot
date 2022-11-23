import { Properties } from "../types/properties"

const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const Discord = require('discord.js')

const addParticipant = (participant: any, interaction: any, array: any, arrayname: any) => {
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

exports.addParticipant = addParticipant

const chunk = (arr: any, chunkSize: any) => {
  const R = []
  for (let i = 0, len = arr.length; i < len; i += chunkSize) {
    R.push(arr.slice(i, i + chunkSize))
  }

  return R
}

exports.chunk = chunk

const purge = (properties: Properties, interaction: any) => {
  const membersInLobby = Array.from(
    interaction.guild.channels.cache.get(properties.config.lobby).members.keys()
  )

  const remainingPlayers = properties.currentPlayers.filter((currentPlayer: any) => membersInLobby.includes(currentPlayer.id)
  )
  logger.debug(
    'Remaining Players are: ' +
      remainingPlayers.map((player: any) => player.username).join(',')
  )

  const purgedPlayers = properties.currentPlayers.filter(
    (currentPlayer: any) => !membersInLobby.includes(currentPlayer.id)
  )
  logger.debug(
    'Purged Players are: ' +
      purgedPlayers.map((player: any) => player.username).join(',')
  )

  properties.currentPlayers = remainingPlayers
  purgedPlayers.forEach((removedPlayer: any) => {
    interaction.channel.send(
      `Purged <@${removedPlayer.id}> from list of current players!`
    )
  })

  const remainingSpectators = properties.currentSpectators.filter(
    (currentSpectator: any) => membersInLobby.includes(currentSpectator.id)
  )
  logger.debug(
    'Remaining Spectators are: ' +
      remainingSpectators.map((spectator: any) => spectator.username).join(',')
  )

  const purgedSpectators = properties.currentSpectators.filter(
    (currentSpectator: any) => !membersInLobby.includes(currentSpectator.id)
  )
  logger.debug(
    'Purged spectators are: ' +
      purgedSpectators.map((spectator: any) => spectator.username).join(',')
  )

  properties.currentSpectators = remainingSpectators
  purgedSpectators.forEach((removedSpectator: any) => {
    interaction.channel.send(
      `Purged <@${removedSpectator.id}> from list of current spectators!`
    )
  })
}

exports.purge = purge

const createEmbed = (list: any, title: any, color: any, interaction: any) => {
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
        };
      })
    )
  return embed
}

exports.createEmbed = createEmbed

const clearTeamRoles = (interaction: any, firstTeamRoleId: any, secondTeamRoleId: any) => {
  const promises: any = []
  if (firstTeamRoleId) {
    interaction.guild.roles.cache
      .get(firstTeamRoleId)
      .members.forEach((member: any) => {
        promises.push(
          member.roles.remove(
            interaction.guild.roles.cache.get(firstTeamRoleId)
          )
        )
      })
  }
  if (secondTeamRoleId) {
    interaction.guild.roles.cache
      .get(secondTeamRoleId)
      .members.forEach((member: any) => {
        promises.push(
          member.roles.remove(
            interaction.guild.roles.cache.get(secondTeamRoleId)
          )
        )
      })
  }
  return promises
}

exports.clearTeamRoles = clearTeamRoles
