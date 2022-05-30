const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription(
      'Remove any roles from every participant and clears last round spectators.'
    ),
  args: '',
  requiresActiveSession: true,
  async execute (interaction, client) {
    interaction.guild.roles.cache
      .get(client.spectatorRoleId)
      .members.forEach(async member => {
        await member.roles.remove(
          interaction.guild.roles.cache.get(client.spectatorRoleId)
        )
      })
    interaction.guild.roles.cache
      .get(client.firstTeamRoleId)
      .members.forEach(async member => {
        await member.roles.remove(
          interaction.guild.roles.cache.get(client.firstTeamRoleId)
        )
      })
    interaction.guild.roles.cache
      .get(client.secondTeamRoleId)
      .members.forEach(async member => {
        await member.roles.remove(
          interaction.guild.roles.cache.get(client.secondTeamRoleId)
        )
      })

    client.lastRoundSpectators = []
    logger.debug('Cleared data and roles from participants!')
    await interaction.reply('I cleared all data and roles from participants!')
  }
}
