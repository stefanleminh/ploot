const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Removes a participant from the session.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to remove from the session')
        .setRequired(true)
    ),
  args: '[@DiscordUser] ...',
  requiresActiveSession: true,
  async execute (interaction, client) {
    const participant = interaction.options.getUser('user')
    if (client.currentPlayers.includes(participant)) {
      client.currentPlayers = client.currentPlayers.filter(
        (player) => player !== participant
      )
      await interaction.reply(
        `Removed participant <@${participant.id}> from the list of current players.`
      )
      logger.debug(
        `Removed participant ${participant.username} from the list of current players.`
      )
    } else if (client.currentSpectators.includes(participant)) {
      client.currentSpectators = client.currentSpectators.filter(
        (spectator) => spectator !== participant
      )
      await interaction.reply(
        `Removed participant <@${participant.id}> from spectator list.`
      )
      logger.debug(
        `Removed participant ${participant.username} from spectator list.`
      )
    } else {
      await interaction.reply(
        `Participant <@${participant.id}> not found as active player or spectator`
      )
      logger.debug(
        `Participant ${participant.username} not found as active player or spectator.`
      )
    }
  }
}
