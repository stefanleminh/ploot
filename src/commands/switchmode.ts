import { Properties } from "../types/properties"

const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('switchmode')
    .setDescription(
      'Switches the player from active player to spectator or vise versa.'
    )
    .addUserOption((option: any) => option
    .setName('user')
    .setDescription('The user whose status to switch')
    .setRequired(true)
    ),
  args: '[@DiscordUser]',
  requiresActiveSession: true,
  async execute (interaction: any, client: any, properties: Properties) {
    const userParameter = interaction.options.getUser('user')
    const lobbyVc = await properties.lobbies.get(interaction.guild.id)

    const guildUser = await interaction.guild.channels.cache
      .get(lobbyVc)
      .members.get(userParameter.id)

    if (!guildUser) {
      logger.info(
        `User ${userParameter.username} not found as an active player or spectator`
      )
      await interaction.reply(
        `Participant <@${userParameter.id}> not found as active player or spectator.`
      )
      return
    }

    const spectatorRoleId = await properties.spectatorRoleIds.get(
      interaction.guild.id
    )
    const isSpectator = [...guildUser.roles.cache.keys()].includes(
      spectatorRoleId
    )
    if (!isSpectator) {
      await guildUser.roles.add(spectatorRoleId)
      logger.info(`User ${userParameter.username} is now a spectator`)
      interaction.reply(`<@${userParameter.id}> is now spectator.`)
    } else {
      await guildUser.roles.remove(spectatorRoleId)
      logger.info(`User ${userParameter.username} is now an active player`)
      interaction.reply(`<@${userParameter.id}> is now an active player.`)
    }
  }
}
