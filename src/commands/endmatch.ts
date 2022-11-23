import { Properties } from "../types/properties"

const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')
const functions = require('../modules/functions')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('endmatch')
    .setDescription(
      'Moves the users from the team channels back to the lobby.'
    ),
  args: '',
  requiresActiveSession: true,
  async execute (interaction: any, client: any, properties: Properties) {
    await interaction.deferReply()

    const lobbyVc = await properties.lobbies.get(interaction.guild.id)
    const firstTeamVc = await properties.firstTeamVcs.get(interaction.guild.id)
    const secondTeamVc = await properties.secondTeamVcs.get(interaction.guild.id)

    const promises: any = []

    const firstTeamRoleId = await properties.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeamRoleId = await properties.secondTeamRoleIds.get(
      interaction.guild.id
    )

    if (interaction.guild.channels.cache.get(firstTeamVc).members.size > 0) {
      interaction.guild.channels.cache
        .get(firstTeamVc)
        .members.forEach((player: any) => {
          promises.push(player.voice.setChannel(lobbyVc))
          logger.info(
            `Moving user ${player.user.username} to voice channel ${lobbyVc.name}`
          )
        })
    }

    if (interaction.guild.channels.cache.get(secondTeamVc).members.size > 0) {
      interaction.guild.channels.cache
        .get(secondTeamVc)
        .members.forEach((player: any) => {
          promises.push(player.voice.setChannel(lobbyVc))
          logger.info(
            `Moving user ${player.user.username} to voice channel ${lobbyVc.name}`
          )
        })
    }

    functions.clearTeamRoles(interaction, firstTeamRoleId, secondTeamRoleId)
    await Promise.all(promises)
    await interaction.editReply('GG!')
  }
}
