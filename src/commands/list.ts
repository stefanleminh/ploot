import { Properties } from '../types/properties'
import { CommandInteraction, Collection, GuildMember } from 'discord.js'

const functions = require('../modules/functions')
const { SlashCommandBuilder } = require('@discordjs/builders')

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
    const currentPlayers = lobbyVcMembers.filter((member: any) => {
      return member.roles.cache.every((role: any) => role.id !== spectatorRoleId) &&
        !member.user.bot
    })
      .map((guildmember: any) => guildmember.user)
    const currentSpectators = lobbyVcMembers.filter((member: any) => {
      return member.roles.cache.some((role: any) => role.id === spectatorRoleId) &&
        !member.user.bot
    })
      .map((guildmember: any) => guildmember.user)

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
      embeds
    })
  }
}
