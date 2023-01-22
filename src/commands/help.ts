import { CommandInteraction } from 'discord.js'
import { Properties } from '../types/properties'
const Discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows this help message.'),
  args: '',
  requiresActiveSession: false,
  async execute (interaction: CommandInteraction, properties: Properties) {
    if (interaction.guild == null) return
    const sortedCommands = properties.commands.sort((a: any, b: any) =>
      a.data.name.localeCompare(b.data.name)
    )
    const helpEmbed = new Discord.MessageEmbed()
      .setTitle('Help')
      .setColor('#B1F7AA')
      .setAuthor({
        name: `${interaction.guild.name} 6v6-Event`,
        iconURL: interaction.guild.iconURL
      })

    sortedCommands.forEach((command: any) => {
      helpEmbed.addField(
        `/${command.data.name} ${command.args}`,
        `${command.data.description}`
      )
    })

    await interaction.reply({ embeds: [helpEmbed] })
  }
}
