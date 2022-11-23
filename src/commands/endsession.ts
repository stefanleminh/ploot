import { Properties } from "../types/properties"

const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('endsession')
    .setDescription('Ends the session and clears all the data.'),
  args: '',
  requiresActiveSession: true,
  async execute (interaction: any, client: any, properties: Properties) {
    const promises = []
    const spectatorRoleId = await properties.spectatorRoleIds.get(
      interaction.guild.id
    )
    const firstTeamRoleId = await properties.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeamRoleId = await properties.secondTeamRoleIds.get(
      interaction.guild.id
    )
    promises.push(
      interaction.guild.roles.delete(spectatorRoleId),
      interaction.guild.roles.delete(firstTeamRoleId),
      interaction.guild.roles.delete(secondTeamRoleId),
      properties.spectatorRoleIds.delete(interaction.guild.id),
      properties.firstTeamRoleIds.delete(interaction.guild.id),
      properties.secondTeamRoleIds.delete(interaction.guild.id),
      properties.lastRoundSpectatorIds.delete(interaction.guild.id)
    )

    await Promise.all(promises)
    logger.debug('Session ended! Cleared all data.')

    await interaction.reply('I ended the session and cleared all data.')
  }
}
