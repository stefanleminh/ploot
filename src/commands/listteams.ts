import { type Command } from '../types/command.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { type Guild, type MessageEmbed, type Role, type User, type Collection, type CommandInteraction, type GuildMember } from 'discord.js'
import { type Properties } from '../types/properties.js'
import { createEmbed } from '../modules/functions.js'
import path from 'path'
import { logging } from '../logging/winston.js'
import { fileURLToPath } from 'url'
// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
const logger = logging(path.basename(__filename))

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('listteams')
    .setDescription('Lists current teams and spectators.'),
  args: '',
  requiresActiveSession: true,
  async execute (interaction: CommandInteraction, properties: Properties) {
    if (interaction.guild == null) return
    if (!interaction.deferred) await interaction.deferReply()

    const [firstTeamRoleId, secondTeamRoleId, spectatorRoleId] = await Promise.all([
      properties.firstTeamRoleIds.get(interaction.guild.id),
      properties.secondTeamRoleIds.get(interaction.guild.id),
      properties.spectatorRoleIds.get(interaction.guild.id)
    ])
    const [lobbyVcId, firstTeamVcId, secondTeamVcId] = await Promise.all([
      properties.lobbies.get(interaction.guild.id),
      properties.firstTeamVcs.get(interaction.guild.id),
      properties.secondTeamVcs.get(interaction.guild.id)
    ])

    // Update cache with new roles
    await interaction.guild.members.fetch()

    const lobbyVcMembers: Collection<string, GuildMember> = (interaction.guild.channels.cache
      .get(lobbyVcId)!
      .members as Collection<string, GuildMember>)
      .filter(member => !member.user.bot)

    const embeds = createTeamEmbeds(lobbyVcMembers, firstTeamRoleId, secondTeamRoleId, spectatorRoleId, interaction.guild, firstTeamVcId, secondTeamVcId, lobbyVcId)
    await interaction.editReply({ embeds })
  }
}

function createTeamEmbeds (lobbyVcMembers: Collection<string, GuildMember>, firstTeamRoleId: any, secondTeamRoleId: any, spectatorRoleId: any, guild: Guild, firstTeamVcId: any, secondTeamVcId: any, lobbyVcId: any): MessageEmbed[] {
  const firstTeam: User[] = lobbyVcMembers
    .filter((member: GuildMember) => member.roles.cache.some((role: Role) => role.id === firstTeamRoleId))
    .map((guildmember: GuildMember) => guildmember.user)

  logger.debug(
    'First team is: ' + firstTeam.map((player: User) => player.username).join(', ')
  )

  const secondTeam: User[] = lobbyVcMembers
    .filter((member: GuildMember) => member.roles.cache.some((role: Role) => role.id === secondTeamRoleId))
    .map((guildmember: GuildMember) => guildmember.user)

  logger.debug(
    'Second team is: ' + secondTeam.map((player: User) => player.username).join(', ')
  )

  const spectatorTeam = lobbyVcMembers.filter(
    (member: GuildMember) => member.roles.cache.every(
      (role: Role) => role.id === spectatorRoleId ||
        (role.id !== firstTeamRoleId && role.id !== secondTeamRoleId)
    ) && !member.user.bot
  )
    .map((guildmember: GuildMember) => guildmember.user)

  logger.debug(
    'Spectators are: ' +
    spectatorTeam.map((player: User) => player.username).join(', ')
  )

  const embeds = [
    createEmbed(
      spectatorTeam,
      guild.channels.cache.get(lobbyVcId)!.name,
      '#ffa500',
      guild
    ),
    createEmbed(
      firstTeam,
      guild.channels.cache.get(firstTeamVcId)!.name,
      '#000088',
      guild
    ),
    createEmbed(
      secondTeam,
      guild.channels.cache.get(secondTeamVcId)!.name,
      '#fe0000',
      guild
    )
  ]
  return embeds
}
