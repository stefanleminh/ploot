import { type CollectorFilter, type CommandInteraction, ComponentType, ChannelType, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { type Properties } from '../types/properties.js'
import path from 'path'
import { logging } from '../logging/winston.js'

import { SlashCommandBuilder } from '@discordjs/builders'
import { fileURLToPath } from 'url'
import { type Command } from 'types/command.js'
// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
const logger = logging(path.basename(__filename))

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('configure')
    .setDescription('Configures the server'),
  args: '',
  requiresActiveSession: false,
  async execute (interaction: CommandInteraction, properties: Properties) {
    if (interaction.guild == null) return
    await interaction.deferReply()

    const voiceChannels = interaction.guild.channels.cache
      .filter(channel => channel.type === ChannelType.GuildVoice)
      .map(channel => ({
        label: channel.name,
        value: channel.id
      }))
    const spectatorVc = new StringSelectMenuBuilder()
      .setCustomId('spectatorVc')
      .setPlaceholder('Please specify the lobby VC')
      .addOptions(voiceChannels)

    const firstTeamVc = new StringSelectMenuBuilder()
      .setCustomId('firstTeamVc')
      .setPlaceholder('Please specify the first team VC')
      .addOptions(voiceChannels)

    const secondTeamVc = new StringSelectMenuBuilder()
      .setCustomId('secondTeamVc')
      .setPlaceholder('Please specify the second team VC')
      .addOptions(voiceChannels)

    const button = new ButtonBuilder()
      .setCustomId('submit')
      .setLabel('Submit')
      .setStyle(ButtonStyle.Primary)

    const spectatorSelect = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(spectatorVc)
    const firstTeamSelect = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(firstTeamVc)
    const secondTeamSelect = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(secondTeamVc)
    const submitRow = new ActionRowBuilder<ButtonBuilder>().addComponents(button)

    const filter: CollectorFilter<any> = i => {
      return i.user.id === interaction.user.id
    }

    const selectCollector = interaction.channel!.createMessageComponentCollector(
      {
        filter,
        componentType: ComponentType.StringSelect
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
      { filter, componentType: ComponentType.Button }
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
