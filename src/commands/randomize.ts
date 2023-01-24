import { Properties } from '../types/properties'
import path from 'path'
import { logging } from '../logging/winston'
import { CommandInteraction, Collection, GuildMember, Role, User } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { clearTeamRoles, createEmbed } from '../modules/functions'
const logger = logging(path.basename(__filename))
const MAX_AMOUNT_OF_PLAYERS = 10

module.exports = {
  data: new SlashCommandBuilder()
    .setName('randomize')
    .setDescription('Randomizes and shows the new teams. '),
  args: '',
  requiresActiveSession: true,
  async execute (interaction: CommandInteraction, properties: Properties) {
    if (!interaction.guild) return
    await interaction.deferReply()
    const firstTeamRoleId: string = await properties.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeamRoleId: string = await properties.secondTeamRoleIds.get(
      interaction.guild.id
    )
    const spectatorRoleId: string = await properties.spectatorRoleIds.get(
      interaction.guild.id
    )

    await Promise.allSettled(
      clearTeamRoles(interaction, firstTeamRoleId, secondTeamRoleId)
    )
    const lobbyVcId: string = await properties.lobbies.get(interaction.guild.id)
    const firstTeamVcId: string = await properties.firstTeamVcs.get(interaction.guild.id)
    const secondTeamVcId: string = await properties.secondTeamVcs.get(interaction.guild.id)
    // Filter out whoever is not in VC
    const lastRoundSpectatorIds: string[] = await properties.lastRoundSpectatorIds.get(
      interaction.guild.id
    )
    const lobbyVcMembers: Collection<string, GuildMember> = interaction.guild.channels.cache
      .get(lobbyVcId)!
      .members as Collection<string, GuildMember>
    const lastRoundSpectatorIdsInLobby: string[] = lobbyVcMembers.filter((member: GuildMember) => lastRoundSpectatorIds.includes(member.id))
      .map((member: GuildMember) => member.id)

    logger.info('==========randomize start==========')
    let playerPool = lastRoundSpectatorIdsInLobby
      .map((id: string) => interaction.guild!.members.cache.get(id)!)
      .slice(0, MAX_AMOUNT_OF_PLAYERS + 1)
    if (playerPool.length > 0) {
      logger.info(
        `Guaranteed players are: ${playerPool
          .map((player: GuildMember) => player.user.username)
          .join(', ')}.`
      )
    }
    if (playerPool.length === MAX_AMOUNT_OF_PLAYERS) {
      const playerPoolIds: string[] = playerPool.map((player: GuildMember) => player.user.id)
      const availablePlayers: Collection<string, GuildMember> = lobbyVcMembers.filter(
        (player: GuildMember) => !playerPool.includes(player) &&
          !player.roles.cache.some((role: Role) => role.id === spectatorRoleId) &&
          !player.user.bot
      )
      const remainingLastRoundSpectators = availablePlayers.filter(
        (player: GuildMember) => !playerPoolIds.includes(player.id)
      )
      await properties.lastRoundSpectatorIds.set(
        interaction.guild.id,
        remainingLastRoundSpectators.map((member: GuildMember) => member.user.id)
      )
      logger.info(
        'Playerpool is filled with last round spectators. Guaranteed players next round: ' +
          remainingLastRoundSpectators
            .map((player: GuildMember) => player.user.username)
            .join(', ')
      )
    } else if (playerPool.length < MAX_AMOUNT_OF_PLAYERS) {
      playerPool = await fillPlayerPool(
        interaction,
        properties,
        playerPool,
        lobbyVcId
      )
    }
    const randomizedPlayerPool = shuffle(playerPool)
    await Promise.allSettled(
      createTeams(randomizedPlayerPool, firstTeamRoleId, secondTeamRoleId)
    )

    // Update cache with new roles
    await interaction.guild.members.fetch()

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
        firstTeam,
        interaction.guild.channels.cache.get(firstTeamVcId)!.name,
        '#000088',
        interaction
      ),
      createEmbed(
        secondTeam,
        interaction.guild.channels.cache.get(secondTeamVcId)!.name,
        '#fe0000',
        interaction
      ),
      createEmbed(
        spectatorTeam,
        interaction.guild.channels.cache.get(lobbyVcId)!.name,
        '#ffa500',
        interaction
      )
    ]
    logger.info('==========randomize end==========')

    await interaction.editReply({ embeds })
  }
}

async function fillPlayerPool (interaction: CommandInteraction, properties: Properties, playerPool: GuildMember[], lobbyVcId: string): Promise<GuildMember[]> {
  logger.info('Entering fillPlayerPool')
  let resultPlayerPool = []
  const spectatorRoleId = await properties.spectatorRoleIds.get(
    interaction.guild!.id
  )
  const randomizedPlayers = shuffle([
    ...(interaction.guild!.channels.cache
      .get(lobbyVcId)!
      .members as Collection<string, GuildMember>).filter(
      (player: GuildMember) => !playerPool.includes(player) &&
        !player.roles.cache.some((role: Role) => role.id === spectatorRoleId) &&
        !player.user.bot
    )
      .values()
  ])
  resultPlayerPool = playerPool.concat(
    randomizedPlayers.slice(0, MAX_AMOUNT_OF_PLAYERS - playerPool.length)
  )
  logger.info(
    `Playerpool is: ${resultPlayerPool.map((player: GuildMember) => player.user.username).join(', ')}`
  )
  // Add rest to spectators
  await properties.lastRoundSpectatorIds.set(
    interaction.guild!.id,
    randomizedPlayers
      .slice(MAX_AMOUNT_OF_PLAYERS - playerPool.length)
      .map((player: GuildMember) => player.user.id)
  )
  logger.info(
    `Players that got added to spectators for this round are: ${randomizedPlayers
      .slice(MAX_AMOUNT_OF_PLAYERS - playerPool.length)
      .map((player: GuildMember) => player.user.username)
      .join(', ')}`
  )
  return resultPlayerPool
}

/**
 * Shuffles array in place.
 * @param {Array} array items An array containing the items.
 */
function shuffle (array: GuildMember[]): GuildMember[] {
  let j
  let x
  let i
  const result = array.slice()
  for (i = result.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = result[i]
    result[i] = result[j]
    result[j] = x
  }
  return result
}

function createTeams (players: GuildMember[], firstTeamRoleId: string, secondTeamRoleId: string): Array<Promise<GuildMember>> {
  logger.info(
    `Creating teams with parameters: ${players}, ${firstTeamRoleId}, ${secondTeamRoleId}`
  )
  const promises: Array<Promise<GuildMember>> = []
  const firstTeam = players.slice(0, players.length / 2)

  firstTeam.forEach((member: GuildMember) => {
    promises.push(member.roles.add(firstTeamRoleId))
  })
  const secondTeam = players.slice(players.length / 2, players.length)

  secondTeam.forEach((member: GuildMember) => {
    promises.push(member.roles.add(secondTeamRoleId))
  })

  return promises
}
