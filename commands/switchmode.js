const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('switchmode')
    .setDescription(
      'Switches the player form active player to spectator or vise versa.'
    )
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user whose status to switch')
        .setRequired(true)
    ),
  args: '[@DiscordUser]',
  requiresActiveSession: true,
  async execute (interaction, client) {
    const userParameter = interaction.options.getUser('user')
    // TODO: Only get members in VC
    const guildUser = await interaction.guild.members.fetch(userParameter.id)

    const isSpectator = Array.from(guildUser.roles.cache.keys()).includes(
      client.spectatorRoleId
    )
    if (!isSpectator) {
      guildUser.roles.add(client.spectatorRoleId).then(() => {
        logger.info(`User ${userParameter.username} is now a spectator`)
        interaction.reply(`<@${userParameter.id}> is now spectator.`)
      })
    } else if (isSpectator) {
      guildUser.roles.remove(client.spectatorRoleId).then(() => {
        logger.info(`User ${userParameter.username} is now an active player`)
        interaction.reply(`<@${userParameter.id}> is now an active player.`)
      })
      await interaction.reply(`<@${userParameter.id}> is now an active player.`)
    } else {
      logger.info(
        `User ${userParameter.username} not found as an active player or spectator`
      )
      await interaction.reply(
        `Participant <@${userParameter.id}> not found as active player or spectator.`
      )
    }
  }
}
