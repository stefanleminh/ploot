const functions = require('../modules/functions')
const { SlashCommandBuilder } = require('@discordjs/builders')
const {
  Modal,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton
} = require('discord.js')
const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

module.exports = {
  data: new SlashCommandBuilder()
    .setName('configure')
    .setDescription('Configures the server'),
  args: '',
  requiresActiveSession: true,
  async execute (interaction, client) {
    await interaction.deferReply()
    const voiceChannels = interaction.guild.channels.cache
      .filter(channel => channel.type === 'GUILD_VOICE')
      .map(channel => ({
        label: channel.name,
        value: channel.id
      }))
    const spectatorVc = new MessageSelectMenu()
      .setCustomId('spectatorVc')
      .setPlaceholder('Nothing selected')
      .addOptions(voiceChannels)

    const firstTeamVc = new MessageSelectMenu()
      .setCustomId('firstTeamVc')
      .setPlaceholder('Nothing selected')
      .addOptions(voiceChannels)

    const secondTeamVc = new MessageSelectMenu()
      .setCustomId('secondTeamVc')
      .setPlaceholder('Nothing selected')
      .addOptions(voiceChannels)

    const button = new MessageButton()
      .setCustomId('submit')
      .setLabel('Submit')
      .setStyle('PRIMARY')

    const spectatorSelect = new MessageActionRow().addComponents(spectatorVc)
    const firstTeamSelect = new MessageActionRow().addComponents(firstTeamVc)
    const secondTeamSelect = new MessageActionRow().addComponents(secondTeamVc)
    const submitRow = new MessageActionRow().addComponents(button)

    const filter = i => {
      return i.user.id === interaction.user.id
    }

    const selectCollector = interaction.channel.createMessageComponentCollector(
      {
        filter,
        componentType: 'SELECT_MENU'
      }
    )

    selectCollector.on('collect', async i => {
      let property
      if (i.customId === 'spectatorVc') {
        property = client.lobbies
      } else if (i.customId === 'firstTeamVc') {
        property = client.firstTeamVcs
      } else if (i.customId === 'secondTeamVc') {
        property = client.secondTeamVcs
      }
      await property.set(i.guild.id, i.values[0])
      i.reply({
        content: `Set ${i.customId} to <#${i.values[0]}>.`,
        ephemeral: true
      })
    })

    const buttonCollector = interaction.channel.createMessageComponentCollector(
      { filter, componentType: 'BUTTON' }
    )
    buttonCollector.on('collect', async i => {
      await interaction.deleteReply()
    })
    await interaction.editReply({
      content: 'Please configure me!',
      components: [
        spectatorSelect,
        firstTeamSelect,
        secondTeamSelect,
        submitRow
      ]
    })
  }
}
