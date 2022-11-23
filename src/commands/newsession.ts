import { Properties } from "../types/properties"

const validation = require('../modules/validation')
const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('newsession')
    .setDescription(
      'Creates a session and roles with the pre-configured channels.'
    ),
  args: '',
  requiresActiveSession: false,
  async execute (interaction: any, client: any, properties: Properties) {
    await interaction.deferReply()
    const isActiveSession = await validation.isActiveSession(
      properties,
      interaction.guild.id
    )
    // TODO: Either run configure or give an error message if not configured
    if (isActiveSession) {
      interaction.editReply(
        "There's already a session running! Please run /endsession first before starting a new session."
      )
      return
    }

    const isConfigured = await validation.isConfigured(
      properties,
      interaction.guild.id
    )
    if (!isConfigured) {
      interaction.editReply(
        'I am not configured for this server yet! Please run /configure first before starting a new session.'
      )
      return
    }
    const lobbyVcId = await properties.lobbies.get(interaction.guild.id)
    const firstTeamVcId = await properties.firstTeamVcs.get(interaction.guild.id)
    const secondTeamVcId = await properties.secondTeamVcs.get(interaction.guild.id)
    const spectatorRole = await interaction.guild.roles.create({
      name: 'Spectators',
      color: '#ffa500',
      reason: 'Spectator role for event'
    })
    logger.info('Setting spectator role id to: ' + spectatorRole.id)
    await properties.spectatorRoleIds.set(interaction.guild.id, spectatorRole.id)

    const firstTeamRole = await interaction.guild.roles.create({
      name: interaction.guild.channels.cache.get(firstTeamVcId).name,
      color: '#000088',
      reason: 'Team role for event'
    })
    logger.info('Setting first team role id to: ' + firstTeamRole.id)
    await properties.firstTeamRoleIds.set(interaction.guild.id, firstTeamRole.id)

    const secondTeamRole = await interaction.guild.roles.create({
      name: interaction.guild.channels.cache.get(secondTeamVcId).name,
      color: '#fe0000',
      reason: 'Team role for event'
    })
    logger.info('Setting second team role id to: ' + secondTeamRole.id)
    await properties.secondTeamRoleIds.set(interaction.guild.id, secondTeamRole.id)

    if (!validation.isActiveSession(properties)) {
      await interaction.reply(
        'Unable to add channels to start a session! Please try again or check the help command.'
      )
      return
    }

    await properties.lastRoundSpectatorIds.set(interaction.guild.id, [])

    await interaction.editReply(
      `New session has been created! <#${lobbyVcId}> is the general/spectator's lobby. <#${firstTeamVcId}> is the first team's lobby. <#${secondTeamVcId}> is the second team's lobby. <@&${spectatorRole.id}> is the role for dedicated spectators. <@&${firstTeamRole.id}> is the first teams role. <@&${secondTeamRole.id}> is the second teams role. `
    )
  }
}
