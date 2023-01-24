import { type Properties } from '../types/properties'

import path from 'path'
import { logging } from '../logging/winston'
import { type CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
const logger = logging(path.basename(__filename))

module.exports = {
  data: new SlashCommandBuilder()
    .setName('endsession')
    .setDescription('Ends the session and clears all the data.'),
  args: '',
  requiresActiveSession: true,
  async execute (interaction: CommandInteraction, properties: Properties) {
    if (interaction.guild == null) return
    const promises: Array<Promise<void>> = []
    const spectatorRoleId = await properties.spectatorRoleIds.get(
      interaction.guild.id
    )
    const firstTeamRoleId = await properties.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeamRoleId = await properties.secondTeamRoleIds.get(
      interaction.guild.id
    )
    promises.push(
      interaction.guild.roles.delete(spectatorRoleId),
      interaction.guild.roles.delete(firstTeamRoleId),
      interaction.guild.roles.delete(secondTeamRoleId),
      properties.spectatorRoleIds.delete(interaction.guild.id),
      properties.firstTeamRoleIds.delete(interaction.guild.id),
      properties.secondTeamRoleIds.delete(interaction.guild.id),
      properties.lastRoundSpectatorIds.delete(interaction.guild.id)
    )

    await Promise.allSettled(promises)
    logger.debug('Session ended! Cleared all data.')

    await interaction.reply('I ended the session and cleared all data.')
  }
}
