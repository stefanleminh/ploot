const validation = require('../modules/validation')
const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('newsession')
    .setDescription('Creates a session with the pre-configured channels.'),
  args: '',
  requiresActiveSession: false,
  async execute (interaction, client) {
    if (validation.isActiveSession(client)) {
      interaction.reply(
        "There's already a session running! Please run /endsession first before starting a new session."
      )
      return
    }

    client.voiceChannels.push(
      interaction.guild.channels.cache.get(client.config.lobby)
    )
    client.voiceChannels.push(
      interaction.guild.channels.cache.get(client.config.firstTeamVc)
    )
    client.voiceChannels.push(
      interaction.guild.channels.cache.get(client.config.secondTeamVc)
    )
    logger.info(
      `Adding following channels to the list: ${
        interaction.guild.channels.cache.get(client.config.lobby).name
      }, ${
        interaction.guild.channels.cache.get(client.config.firstTeamVc).name
      }, ${
        interaction.guild.channels.cache.get(client.config.secondTeamVc).name
      }`
    )
    if (!validation.isActiveSession(client)) {
      await interaction.reply(
        'Unable to add channels to start a session! Please try again or check the help command.'
      )
      client.voiceChannels = []
      return
    }

    await interaction.reply(
      'New session has been created! `' +
        client.voiceChannels[0].name +
        "` is the general/spectator's lobby. `" +
        client.voiceChannels[1].name +
        "` is the first team's lobby. `" +
        client.voiceChannels[2].name +
        "` is the second team's lobby. You can now add users."
    )
  }
}
