import Discord, { type CommandInteraction } from 'discord.js'
import { type Properties } from '../types/properties.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { type Command } from '../types/command.js'

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows this help message.'),
  args: '',
  requiresActiveSession: false,
  async execute (interaction: CommandInteraction, properties: Properties) {
    if (interaction.guild == null) return
    const sortedCommands = properties.commands.sort((a: Command, b: Command) =>
      a.data.name.localeCompare(b.data.name)
    )
    const helpEmbed = new Discord.EmbedBuilder()
      .setTitle('Help')
      .setColor('#B1F7AA')
      .setAuthor({
        name: `${interaction.guild.name} 6v6-Event`,
        iconURL: `${interaction.guild.iconURL()}`
      })

    sortedCommands.forEach((command: Command) => {
      helpEmbed.addFields({
        name: `/${command.data.name} ${command.args}`,
        value: `${command.data.description}`
      })
    })

    await interaction.reply({ embeds: [helpEmbed] })
  }
}
