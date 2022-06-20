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
    await interaction.deferReply()
    const promises = []
    interaction.guild.roles.cache
      .get(client.spectatorRoleId)
      .members.forEach(member => {
        promises.push(
          member.roles.remove(
            interaction.guild.roles.cache.get(client.spectatorRoleId)
          )
        )
      })
    interaction.guild.roles.cache
      .get(client.firstTeamRoleId)
      .members.forEach(member => {
        promises.push(
          member.roles.remove(
            interaction.guild.roles.cache.get(client.firstTeamRoleId)
          )
        )
      })
    interaction.guild.roles.cache
      .get(client.secondTeamRoleId)
      .members.forEach(member => {
        promises.push(
          member.roles.remove(
            interaction.guild.roles.cache.get(client.secondTeamRoleId)
          )
        )
      })

    client.lastRoundSpectators = []
    await Promise.all(promises)
    logger.debug('Cleared data and roles from participants!')
    await interaction.editReply(
      'I cleared all data and roles from participants!'
    )
  }
}
