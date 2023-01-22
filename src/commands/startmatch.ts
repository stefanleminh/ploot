import { Properties } from "../types/properties"

import path from 'path'
import {logging} from '../logging/winston'
const logger = logging(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('startmatch')
    .setDescription('Moves the users to the designated team channels. '),
  args: '',
  requiresActiveSession: true,
  async execute (interaction: any, properties: Properties) {
    const promises: any = []
    await interaction.deferReply()

    const lobbyVcId = await properties.lobbies.get(interaction.guild.id)
    const firstTeamVcId = await properties.firstTeamVcs.get(interaction.guild.id)
    const secondTeamVcId = await properties.secondTeamVcs.get(interaction.guild.id)

    const firstTeamRoleId = await properties.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const firstTeam = interaction.guild.channels.cache
      .get(lobbyVcId)
      .members.filter((member: any) => member.roles.cache.some((role: any) => role.id === firstTeamRoleId)
      )
      .map((guildmember: any) => guildmember.user)

    const secondTeamRoleId = await properties.secondTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeam = interaction.guild.channels.cache
      .get(lobbyVcId)
      .members.filter((member: any) => member.roles.cache.some((role: any) => role.id === secondTeamRoleId)
      )
      .map((guildmember: any) => guildmember.user)

    firstTeam.forEach((player: any) => {
      const member = interaction.guild.members.cache.get(player.id)
      promises.push(setVoiceChannel(member, firstTeamVcId, interaction))
    })

    secondTeam.forEach((player: any) => {
      const member = interaction.guild.members.cache.get(player.id)
      promises.push(setVoiceChannel(member, secondTeamVcId, interaction))
    })
    await Promise.all(promises)
    await interaction.editReply('GLHF!')
  }
}
function setVoiceChannel (member: any, voiceChannel: any, interaction: any) {
  if (member.voice.channel) {
    if (member.voice.channel.id !== voiceChannel.id) {
      logger.info(
        `Moving user ${member.user.username} to voice channel ${
          interaction.guild.channels.cache.get(voiceChannel).name
        }`
      )
      return member.voice.setChannel(voiceChannel)
    } else if (member.voice.channel.id === voiceChannel.id) {
      logger.info(
        `User ${member.user.username} is already in the correct vc and will not be moved.`
      )
    }
  } else {
    logger.info(
      `User ${member.user.username} is not connected to the lobby and will not be moved.`
    )
    interaction.channel.send(
      `<@${member.user.id}> is not connected to the lobby and will not be moved.`
    )
  }
}
