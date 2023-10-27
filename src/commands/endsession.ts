import { type Properties } from '../types/properties.js'

import path from 'path'
import { logging } from '../logging/winston.js'
import { type CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { fileURLToPath } from 'url'
import { type Command } from 'types/command.js'
// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
const logger = logging(path.basename(__filename))

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('endsession')
    .setDescription('Ends the session and clears all the data.'),
  args: '',
  requiresActiveSession: true,
  async execute (interaction: CommandInteraction, properties: Properties) {
    if (interaction.guild == null) return
    await interaction.deferReply()
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
      properties.guaranteedPlayersNextRoundIds.delete(interaction.guild.id)
    )

    await Promise.allSettled(promises)
    logger.debug('Session ended! Cleared all data.')

    await interaction.editReply('I ended the session and cleared all data.')
  }
}
