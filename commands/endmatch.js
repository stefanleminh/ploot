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
    // TODO: Go through ids instead of array
    const spectatorTeamVc = interaction.guild.channels.cache.get(
      client.config.lobby
    )
    const firstTeamVc = interaction.guild.channels.cache.get(
      client.config.firstTeamVc
    )
    const secondTeamVc = interaction.guild.channels.cache.get(
      client.config.secondTeamVc
    )
    if (firstTeamVc.members.size > 0) {
      firstTeamVc.members.forEach(async player => {
        await player.voice.setChannel(spectatorTeamVc)
        logger.info(
          `Moved user ${player.user.username} to voice channel ${spectatorTeamVc.name}`
        )
      })
    }

    if (secondTeamVc.members.size > 0) {
      secondTeamVc.members.forEach(async player => {
        await player.voice.setChannel(spectatorTeamVc)
        logger.info(
          `Moved user ${player.user.username} to voice channel ${spectatorTeamVc.name}`
        )
      })
    }
    await interaction.reply('GG!')
  }
}
