const clear = require('./clear')
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
    client.lastRoundSpectators = []
    await interaction.guild.roles.delete(client.spectatorRoleId)

    await interaction.guild.roles.delete(client.firstTeamRoleId)

    await interaction.guild.roles.delete(client.secondTeamRoleId)

    logger.debug('Session ended! Cleared all data.')

    await interaction.reply('I ended the session and cleared all data.')
  }
}
