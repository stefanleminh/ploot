import { Properties } from '../types/properties'

import path from 'path'
import { logging } from '../logging/winston'
import { CommandInteraction, Collection, GuildMember } from 'discord.js'
const logger = logging(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')
const functions = require('../modules/functions')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('endmatch')
    .setDescription(
      'Moves the users from the team channels back to the lobby.'
    ),
  args: '',
  requiresActiveSession: true,
  async execute (interaction: CommandInteraction, properties: Properties) {
    if (interaction.guild == null) return
    await interaction.deferReply()

    const lobbyVc = await properties.lobbies.get(interaction.guild.id)
    const firstTeamVc = await properties.firstTeamVcs.get(interaction.guild.id)
    const secondTeamVc = await properties.secondTeamVcs.get(interaction.guild.id)

    const promises: any = []

    const firstTeamRoleId = await properties.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeamRoleId = await properties.secondTeamRoleIds.get(
      interaction.guild.id
    )
    const firstTeamVcMembers = interaction.guild.channels.cache.get(firstTeamVc)!.members as Collection<string, GuildMember>
    if (firstTeamVcMembers.size > 0) {
      firstTeamVcMembers.forEach((player: any) => {
        promises.push(player.voice.setChannel(lobbyVc))
        logger.info(
            `Moving user ${player.user.username} to voice channel ${lobbyVc.name}`
        )
      })
    }

    const secondTeamVcMembers = interaction.guild.channels.cache.get(secondTeamVc)!.members as Collection<string, GuildMember>
    if (secondTeamVcMembers.size > 0) {
      secondTeamVcMembers.forEach((player: any) => {
        promises.push(player.voice.setChannel(lobbyVc))
        logger.info(
            `Moving user ${player.user.username} to voice channel ${lobbyVc.name}`
        )
      })
    }

    functions.clearTeamRoles(interaction, firstTeamRoleId, secondTeamRoleId)
    await Promise.all(promises)
    await interaction.editReply('GG!')
  }
}
