const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('endmatch')
    .setDescription(
      'Moves the users back to the lobby. The user has to be in a VC to work.'
    ),
  args: '',
  requiresActiveSession: true,
  async execute (interaction, client) {
    if (client.voiceChannels[1].members.size > 0) {
      client.voiceChannels[1].members.forEach((player) => {
        player.voice.setChannel(client.voiceChannels[0])
        logger.info(
          `Moved user ${player.user.username} to voice channel ${client.voiceChannels[0].name}`
        )
      })
    }

    if (client.voiceChannels[2].members.size > 0) {
      client.voiceChannels[2].members.forEach((player) => {
        player.voice.setChannel(client.voiceChannels[0])
        logger.info(
          `Moved user ${player.user.username} to voice channel ${client.voiceChannels[1].name}`
        )
      })
    }
    await interaction.reply('I moved everyone back to the lobby! GGs')
  }
}
