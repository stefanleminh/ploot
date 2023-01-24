import { Properties } from '../types/properties'
import { CommandInteraction, Collection, GuildMember, Role } from 'discord.js'

import { SlashCommandBuilder } from '@discordjs/builders'
import { createEmbed } from '../modules/functions'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('Lists active players and spectators.'),
  args: '',
  requiresActiveSession: true,
  async execute (interaction: CommandInteraction, properties: Properties) {
    if (interaction.guild == null) return
    await interaction.deferReply()

    const lobbyVc = await properties.lobbies.get(interaction.guild.id)

    const spectatorRoleId = await properties.spectatorRoleIds.get(
      interaction.guild.id
    )
    const lobbyVcMembers = interaction.guild.channels.cache
      .get(lobbyVc)!.members as Collection<string, GuildMember>
    const currentPlayers = lobbyVcMembers.filter((member: GuildMember) => {
      return member.roles.cache.every((role: Role) => role.id !== spectatorRoleId) &&
        !member.user.bot
    })
      .map((guildmember: GuildMember) => guildmember.user)
    const currentSpectators = lobbyVcMembers.filter((member: GuildMember) => {
      return member.roles.cache.some((role: Role) => role.id === spectatorRoleId) &&
        !member.user.bot
    })
      .map((guildmember: GuildMember) => guildmember.user)

    const embeds = [
      createEmbed(currentPlayers, 'Players', '#000088', interaction),
      createEmbed(
        currentSpectators,
        'Spectators',
        '#fe0000',
        interaction
      )
    ]

    await interaction.editReply({
      embeds
    })
  }
}
