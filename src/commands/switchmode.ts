import { Properties } from '../types/properties'

import path from 'path'
import { logging } from '../logging/winston'
import { CommandInteraction, Collection, GuildMember } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
const logger = logging(path.basename(__filename))

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
  async execute (interaction: CommandInteraction, properties: Properties) {
    if (interaction.guild == null) return
    const userParameter = interaction.options.getUser('user')
    if (userParameter == null) return
    const lobbyVc = await properties.lobbies.get(interaction.guild.id)

    const lobbyVcMembers = interaction.guild.channels.cache
      .get(lobbyVc)!.members as Collection<string, GuildMember>
    const guildUser = lobbyVcMembers.get(userParameter.id)

    if (guildUser == null) {
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
      await interaction.reply(`<@${userParameter.id}> is now spectator.`)
    } else {
      await guildUser.roles.remove(spectatorRoleId)
      logger.info(`User ${userParameter.username} is now an active player`)
      await interaction.reply(`<@${userParameter.id}> is now an active player.`)
    }
  }
}
