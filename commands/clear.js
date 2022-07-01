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
    const spectatorRoleId = await client.spectatorRoleIds.get(
      interaction.guild.id
    )
    const firstTeamRoleId = await client.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeamRoleId = await client.secondTeamRoleIds.get(
      interaction.guild.id
    )

    if (spectatorRoleId) {
      interaction.guild.roles.cache
        .get(spectatorRoleId)
        .members.forEach(member => {
          promises.push(
            member.roles.remove(
              interaction.guild.roles.cache.get(client.spectatorRoleId)
            )
          )
        })
    }

    if (firstTeamRoleId) {
      interaction.guild.roles.cache
        .get(firstTeamRoleId)
        .members.forEach(member => {
          promises.push(
            member.roles.remove(
              interaction.guild.roles.cache.get(client.firstTeamRoleId)
            )
          )
        })
    }
    if (secondTeamRoleId) {
      interaction.guild.roles.cache
        .get(secondTeamRoleId)
        .members.forEach(member => {
          promises.push(
            member.roles.remove(
              interaction.guild.roles.cache.get(client.secondTeamRoleId)
            )
          )
        })
    }

    await client.lastRoundSpectators.set(interaction.guild.id, [])
    await Promise.all(promises)
    logger.debug('Cleared data and roles from participants!')
    await interaction.editReply(
      'I cleared all data and roles from participants!'
    )
  }
}
