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
    clear.clearLists(client)
    client.voiceChannels = []
    interaction.guild.roles
      .delete(client.spectatorRoleId)
      .catch(logger.error('Error deleting spectator role!'))

    interaction.guild.roles
      .delete(client.firstTeamRoleId)
      .catch(logger.error('Error deleting role for team one!'))

    interaction.guild.roles
      .delete(client.secondTeamRoleId)
      .catch(logger.error('Error deleting role for team two!'))

    logger.debug('Session ended! Cleared all lists and roles.')

    await interaction.reply(
      'I ended the session and cleared all lists and roles.'
    )
  }
}
