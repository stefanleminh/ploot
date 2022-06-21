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
    client.lastRoundSpectators = []
    promises.push(
      interaction.guild.roles.delete(client.spectatorRoleId),
      interaction.guild.roles.delete(client.firstTeamRoleId),
      interaction.guild.roles.delete(client.secondTeamRoleId)
    )
    client.spectatorRoleId = ''
    client.firstTeamRoleId = ''
    client.secondTeamRoleId = ''
    await Promise.all(promises)
    logger.debug('Session ended! Cleared all data.')

    await interaction.reply('I ended the session and cleared all data.')
  }
}
