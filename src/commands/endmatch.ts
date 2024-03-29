import { type Properties } from '../types/properties.js'

import path from 'path'
import { logging } from '../logging/winston.js'
import { type CommandInteraction, type Collection, type GuildMember } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { clearTeamRoles } from '../modules/functions.js'
import { fileURLToPath } from 'url'
import { type Command } from 'types/command.js'
// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
const logger = logging(path.basename(__filename))

export const command: Command = {
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

    const promises: Array<Promise<GuildMember>> = []

    const firstTeamRoleId = await properties.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeamRoleId = await properties.secondTeamRoleIds.get(
      interaction.guild.id
    )
    const firstTeamVcMembers = interaction.guild.channels.cache.get(firstTeamVc)!.members as Collection<string, GuildMember>
    if (firstTeamVcMembers.size > 0) {
      firstTeamVcMembers.forEach((player: GuildMember) => {
        promises.push(player.voice.setChannel(lobbyVc))
        logger.info(
            `Moving user ${player.user.username} to voice channel ${lobbyVc.name}`
        )
      })
    }

    const secondTeamVcMembers = interaction.guild.channels.cache.get(secondTeamVc)!.members as Collection<string, GuildMember>
    if (secondTeamVcMembers.size > 0) {
      secondTeamVcMembers.forEach((player: GuildMember) => {
        promises.push(player.voice.setChannel(lobbyVc))
        logger.info(
            `Moving user ${player.user.username} to voice channel ${lobbyVc.name}`
        )
      })
    }

    await Promise.all(clearTeamRoles(interaction.guild.roles.cache, firstTeamRoleId, secondTeamRoleId, interaction.guild.members))
    await Promise.all(promises)
    await interaction.editReply('GG!')
  }
}
