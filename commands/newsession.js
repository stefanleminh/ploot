const validation = require('../modules/validation')
const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('newsession')
    .setDescription(
      'Creates a session and roles with the pre-configured channels.'
    ),
  args: '',
  requiresActiveSession: false,
  async execute (interaction, client) {
    if (validation.isActiveSession(client)) {
      interaction.reply(
        "There's already a session running! Please run /endsession first before starting a new session."
      )
      return
    }
    const spectatorRole = await interaction.guild.roles.create({
      name: 'Spectators',
      color: '#ffa500',
      reason: 'Spectator role for event'
    })
    logger.info('Setting spectator role id to: ' + spectatorRole.id)
    client.spectatorRoleId = spectatorRole.id

    const firstTeamRole = await interaction.guild.roles.create({
      name: interaction.guild.channels.cache.get(client.config.firstTeamVc)
        .name,
      color: '#000088',
      reason: 'Team role for event'
    })
    logger.info('Setting first team role id to: ' + firstTeamRole.id)
    client.firstTeamRoleId = firstTeamRole.id

    const secondTeamRole = await interaction.guild.roles.create({
      name: interaction.guild.channels.cache.get(client.config.secondTeamVc)
        .name,
      color: '#fe0000',
      reason: 'Team role for event'
    })
    logger.info('Setting second team role id to: ' + secondTeamRole.id)
    client.secondTeamRoleId = secondTeamRole.id

    if (!validation.isActiveSession(client)) {
      await interaction.reply(
        'Unable to add channels to start a session! Please try again or check the help command.'
      )
      client.voiceChannels = []
      return
    }

    await interaction.reply(
      'New session has been created! `' +
        interaction.guild.channels.cache.get(client.config.lobby).name +
        "` is the general/spectator's lobby. `" +
        interaction.guild.channels.cache.get(client.config.firstTeamVc).name +
        "` is the first team's lobby. `" +
        interaction.guild.channels.cache.get(client.config.secondTeamVc).name +
        "` is the second team's lobby. You can now add users."
    )
  }
}
