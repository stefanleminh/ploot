import { type Properties } from '../types/properties.js'

import path from 'path'
import { logging } from '../logging/winston.js'
import { type CommandInteraction, type Collection, type GuildMember, type VoiceChannel, type Role, type User } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { fileURLToPath } from 'url'
import { type Command } from 'types/command.js'
// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
const logger = logging(path.basename(__filename))

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('startmatch')
    .setDescription('Moves the users to the designated team channels. '),
  args: '',
  requiresActiveSession: true,
  async execute (interaction: CommandInteraction, properties: Properties) {
    if (!interaction.guild) return

    const promises: Array<Promise<GuildMember>> = []
    await interaction.deferReply()

    const lobbyVcId = await properties.lobbies.get(interaction.guild.id)
    if (interaction.guild.channels.cache
      .get(lobbyVcId) === undefined) return
    const firstTeamVcId = await properties.firstTeamVcs.get(interaction.guild.id)
    const secondTeamVcId = await properties.secondTeamVcs.get(interaction.guild.id)

    const firstTeamRoleId = await properties.firstTeamRoleIds.get(
      interaction.guild.id
    )

    // Update cache with new roles
    await interaction.guild.members.fetch()

    const lobbyVcMembers = interaction.guild.channels.cache
      .get(lobbyVcId)!
      .members as Collection<string, GuildMember>
    const firstTeam = lobbyVcMembers.filter((member: GuildMember) => member.roles.cache.some((role: Role) => role.id === firstTeamRoleId)
    )
      .map((guildmember: GuildMember) => guildmember.user)

    const secondTeamRoleId = await properties.secondTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeam = lobbyVcMembers.filter((member: GuildMember) => member.roles.cache.some((role: Role) => role.id === secondTeamRoleId)
    )
      .map((guildmember: GuildMember) => guildmember.user)

    firstTeam.forEach((player: User) => {
      const member = interaction.guild!.members.cache.get(player.id)!
      promises.push(setVoiceChannel(member, firstTeamVcId, interaction))
    })

    secondTeam.forEach((player: User) => {
      const member = interaction.guild!.members.cache.get(player.id)!
      promises.push(setVoiceChannel(member, secondTeamVcId, interaction))
    })
    await Promise.all(promises)
    await interaction.editReply('GLHF!')
  }
}
async function setVoiceChannel (member: GuildMember, voiceChannel: VoiceChannel, interaction: CommandInteraction): Promise<GuildMember> {
  if (member.voice.channel == null) {
    logger.info(`User ${member.user.username} is not connected to a voice channel and will not be moved.`)
    await interaction.channel!.send(`<@${member.user.id}> is not connected to a voice channel and will not be moved.`)
    return member
  }
  if (member.voice.channel.id === voiceChannel.id) {
    logger.info(`User ${member.user.username} is already in the correct voice channel and will not be moved.`)
    return member
  }
  logger.info(`Moving user ${member.user.username} to voice channel ${voiceChannel.name}`)
  await member.voice.setChannel(voiceChannel)
  return member
}
