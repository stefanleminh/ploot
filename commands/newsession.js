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
    await interaction.deferReply()
    if (await validation.isActiveSession(client, interaction.guild.id)) {
      interaction.editReply(
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
    await client.spectatorRoleIds.set(interaction.guild.id, spectatorRole.id)

    const firstTeamRole = await interaction.guild.roles.create({
      name: interaction.guild.channels.cache.get(client.config.firstTeamVc)
        .name,
      color: '#000088',
      reason: 'Team role for event'
    })
    logger.info('Setting first team role id to: ' + firstTeamRole.id)
    await client.firstTeamRoleIds.set(interaction.guild.id, firstTeamRole.id)

    const secondTeamRole = await interaction.guild.roles.create({
      name: interaction.guild.channels.cache.get(client.config.secondTeamVc)
        .name,
      color: '#fe0000',
      reason: 'Team role for event'
    })
    logger.info('Setting second team role id to: ' + secondTeamRole.id)
    await client.secondTeamRoleIds.set(interaction.guild.id, secondTeamRole.id)

    if (!validation.isActiveSession(client)) {
      await interaction.reply(
        'Unable to add channels to start a session! Please try again or check the help command.'
      )
      return
    }

    await client.lastRoundSpectators.set(interaction.guild.id, [])

    await interaction.editReply(
      'New session has been created! `' +
        interaction.guild.channels.cache.get(client.config.lobby).name +
        "` is the general/spectator's lobby. `" +
        interaction.guild.channels.cache.get(client.config.firstTeamVc).name +
        "` is the first team's lobby. `" +
        interaction.guild.channels.cache.get(client.config.secondTeamVc).name +
        "` is the second team's lobby. <@&" +
        firstTeamRole.id +
        '> is the first teams role. <@&' +
        secondTeamRole.id +
        '> is the second teams role. '
    )
  }
}
