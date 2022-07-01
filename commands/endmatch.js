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

    const promises = []
    const spectatorTeamVc = interaction.guild.channels.cache.get(
      client.config.lobby
    )
    const firstTeamVc = interaction.guild.channels.cache.get(
      client.config.firstTeamVc
    )
    const secondTeamVc = interaction.guild.channels.cache.get(
      client.config.secondTeamVc
    )
    const firstTeamRoleId = await client.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeamRoleId = await client.secondTeamRoleIds.get(
      interaction.guild.id
    )

    if (firstTeamVc.members.size > 0) {
      firstTeamVc.members.forEach(player => {
        promises.push(player.voice.setChannel(spectatorTeamVc))
        logger.info(
          `Moving user ${player.user.username} to voice channel ${spectatorTeamVc.name}`
        )
      })
    }

    if (secondTeamVc.members.size > 0) {
      secondTeamVc.members.forEach(player => {
        promises.push(player.voice.setChannel(spectatorTeamVc))
        logger.info(
          `Moving user ${player.user.username} to voice channel ${spectatorTeamVc.name}`
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
