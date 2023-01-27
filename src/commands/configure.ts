import { type CollectorFilter, type CommandInteraction, MessageActionRow, MessageSelectMenu, MessageButton } from 'discord.js'
import { type Properties } from '../types/properties'
import path from 'path'
import { logging } from '../logging/winston'

import { SlashCommandBuilder } from '@discordjs/builders'

const logger = logging(path.basename(__filename))

module.exports = {
  data: new SlashCommandBuilder()
    .setName('configure')
    .setDescription('Configures the server'),
  args: '',
  requiresActiveSession: false,
  async execute (interaction: CommandInteraction, properties: Properties) {
    if (interaction.guild == null) return
    await interaction.deferReply()

    const voiceChannels = interaction.guild.channels.cache
      .filter(channel => channel.type === 'GUILD_VOICE')
      .map(channel => ({
        label: channel.name,
        value: channel.id
      }))
    const spectatorVc = new MessageSelectMenu()
      .setCustomId('spectatorVc')
      .setPlaceholder('Please specify the lobby VC')
      .addOptions(voiceChannels)

    const firstTeamVc = new MessageSelectMenu()
      .setCustomId('firstTeamVc')
      .setPlaceholder('Please specify the first team VC')
      .addOptions(voiceChannels)

    const secondTeamVc = new MessageSelectMenu()
      .setCustomId('secondTeamVc')
      .setPlaceholder('Please specify the second team VC')
      .addOptions(voiceChannels)

    const button = new MessageButton()
      .setCustomId('submit')
      .setLabel('Submit')
      .setStyle('PRIMARY')

    const spectatorSelect = new MessageActionRow().addComponents(spectatorVc)
    const firstTeamSelect = new MessageActionRow().addComponents(firstTeamVc)
    const secondTeamSelect = new MessageActionRow().addComponents(secondTeamVc)
    const submitRow = new MessageActionRow().addComponents(button)

    const filter: CollectorFilter<any> = i => {
      return i.user.id === interaction.user.id
    }

    const selectCollector = interaction.channel!.createMessageComponentCollector(
      {
        filter,
        componentType: 'SELECT_MENU'
      }
    )

    selectCollector.on('collect', async selectInteraction => {
      if (selectInteraction.guild === null || selectInteraction.guild === undefined) {
        throw new Error('Interaction is not part of a guild!')
      }
      let property
      if (selectInteraction.customId === 'spectatorVc') {
        property = properties.lobbies
      } else if (selectInteraction.customId === 'firstTeamVc') {
        property = properties.firstTeamVcs
      } else if (selectInteraction.customId === 'secondTeamVc') {
        property = properties.secondTeamVcs
      }

      await property.set(
        selectInteraction.guild.id,
        selectInteraction.values[0]
      )
      const channelName = interaction.guild!.channels.cache.get(
        selectInteraction.values[0]
      )!.name
      logger.info(`Set ${selectInteraction.customId} to ${channelName}.`)
      await selectInteraction.reply({
        content: `Set ${selectInteraction.customId} to <#${selectInteraction.values[0]}>.`,
        ephemeral: true
      })
    })

    const buttonCollector = interaction.channel!.createMessageComponentCollector(
      { filter, componentType: 'BUTTON' }
    )
    buttonCollector.on('collect', async i => {
      await interaction.editReply({
        content: 'I am ready to go!',
        components: []
      })
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
