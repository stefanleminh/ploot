import Discord, { type CommandInteraction } from 'discord.js'
import { type Properties } from '../types/properties'
import { SlashCommandBuilder } from '@discordjs/builders'
import { type Command } from '../types/command'

module.exports = {
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
    const helpEmbed = new Discord.MessageEmbed()
      .setTitle('Help')
      .setColor('#B1F7AA')
      .setAuthor({
        name: `${interaction.guild.name} 6v6-Event`,
        iconURL: `${interaction.guild.iconURL()}`
      })

    sortedCommands.forEach((command: Command) => {
      helpEmbed.addField(
        `/${command.data.name} ${command.args}`,
        `${command.data.description}`
      )
    })

    await interaction.reply({ embeds: [helpEmbed] })
  }
}
