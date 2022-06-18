const functions = require('../modules/functions')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('Lists active players and spectators.'),
  args: '',
  requiresActiveSession: true,
  async execute (interaction, client) {
    await interaction.deferReply()
    const currentPlayers = interaction.guild.channels.cache
      .get(client.config.lobby)
      .members.filter(member => {
        return (
          member.roles.cache.every(
            role => role.id !== client.spectatorRoleId
          ) && !member.user.bot
        )
      })
      .map(guildmember => guildmember.user)
    const currentSpectators = interaction.guild.channels.cache
      .get(client.config.lobby)
      .members.filter(member => {
        return (
          member.roles.cache.some(role => role.id === client.spectatorRoleId) &&
          !member.user.bot
        )
      })
      .map(guildmember => guildmember.user)

    const embeds = [
      functions.createEmbed(currentPlayers, 'Players', '#000088', interaction),
      functions.createEmbed(
        currentSpectators,
        'Spectators',
        '#fe0000',
        interaction
      )
    ]

    await interaction.editReply({
      embeds: embeds
    })
  }
}
