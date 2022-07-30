const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('endmatch')
    .setDescription(
      'Moves the users from the team channels back to the lobby.'
    ),
  args: '',
  requiresActiveSession: true,
  async execute (interaction, client) {
    await interaction.deferReply()

    const lobbyVc = await client.lobbies.get(interaction.guild.id)
    const firstTeamVc = await client.firstTeamVcs.get(interaction.guild.id)
    const secondTeamVc = await client.secondTeamVcs.get(interaction.guild.id)

    const promises = []

    const firstTeamRoleId = await client.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeamRoleId = await client.secondTeamRoleIds.get(
      interaction.guild.id
    )

    if (interaction.guild.channels.cache.get(firstTeamVc).members.size > 0) {
      interaction.guild.channels.cache
        .get(firstTeamVc)
        .members.forEach(player => {
          promises.push(player.voice.setChannel(lobbyVc))
          logger.info(
            `Moving user ${player.user.username} to voice channel ${lobbyVc.name}`
          )
        })
    }

    if (interaction.guild.channels.cache.get(secondTeamVc).members.size > 0) {
      interaction.guild.channels.cache
        .get(secondTeamVc)
        .members.forEach(player => {
          promises.push(player.voice.setChannel(lobbyVc))
          logger.info(
            `Moving user ${player.user.username} to voice channel ${lobbyVc.name}`
          )
        })
    }

    interaction.guild.roles.cache
      .get(firstTeamRoleId)
      .members.forEach(member => {
        promises.push(
          member.roles.remove(
            interaction.guild.roles.cache.get(firstTeamRoleId)
          )
        )
      })

    interaction.guild.roles.cache
      .get(secondTeamRoleId)
      .members.forEach(member => {
        promises.push(
          member.roles.remove(
            interaction.guild.roles.cache.get(secondTeamRoleId)
          )
        )
      })
    await Promise.all(promises)
    await interaction.editReply('GG!')
  }
}
