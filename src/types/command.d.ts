import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { Properties } from './properties'
export interface Command {
  data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
  args: string
  requiresActiveSession: boolean
  execute: (interaction: CommandInteraction, properties: Properties) => Promise<void>
}
