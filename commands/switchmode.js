const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('switchmode')
    .setDescription(
      'Switches the player form active player to spectator or vise versa.'
    )
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user whose status to switch')
        .setRequired(true)
    ),
  args: '[@DiscordUser]',
  requiresActiveSession: true,
  async execute (interaction, client) {
    const participant = interaction.options.getUser('user')

    if (client.currentPlayers.includes(participant)) {
      client.currentSpectators.push(participant)
      client.currentPlayers = client.currentPlayers.filter(
        (element) => element !== participant
      )
      logger.info(`User ${participant.username} is now a spectator`)
      await interaction.reply(`<@${participant.id}> is now spectator.`)
    } else if (client.currentSpectators.includes(participant)) {
      client.currentPlayers.push(participant)
      client.currentSpectators = client.currentSpectators.filter(
        (element) => element !== participant
      )
      logger.info(`User ${participant.username} is now an active player`)
      await interaction.reply(`<@${participant.id}> is now an active player.`)
    } else {
      logger.info(
        `User ${participant.username} not found as an active player or spectator`
      )
      await interaction.reply(
        `Participant <@${participant.id}> not found as active player or spectator.`
      )
    }
  }
}
