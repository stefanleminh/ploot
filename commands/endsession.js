const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('endsession')
    .setDescription('Ends the session and clears all the data.'),
  args: '',
  requiresActiveSession: true,
  async execute (interaction, client) {
    const promises = []
    const spectatorRoleId = await client.spectatorRoleIds.get(
      interaction.guild.id
    )
    const firstTeamRoleId = await client.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeamRoleId = await client.secondTeamRoleIds.get(
      interaction.guild.id
    )
    promises.push(
      interaction.guild.roles.delete(spectatorRoleId),
      interaction.guild.roles.delete(firstTeamRoleId),
      interaction.guild.roles.delete(secondTeamRoleId),
      client.spectatorRoleIds.delete(interaction.guild.id),
      client.firstTeamRoleIds.delete(interaction.guild.id),
      client.secondTeamRoleIds.delete(interaction.guild.id),
      client.lastRoundSpectators.delete(interaction.guild.id)
    )

    await Promise.all(promises)
    logger.debug('Session ended! Cleared all data.')

    await interaction.reply('I ended the session and cleared all data.')
  }
}
