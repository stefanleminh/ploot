import { type Properties } from '../types/properties.js'
import path from 'path'
import { logging } from '../logging/winston.js'
import { type CommandInteraction, type Collection, type GuildMember, type Role, type User, type Guild, MessageEmbed } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { clearTeamRoles, createTeamEmbeds } from '../modules/functions.js'
import { fileURLToPath } from 'url'
import { type Command } from 'types/command.js'
// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
const logger = logging(path.basename(__filename))
const MAX_AMOUNT_OF_PLAYERS = 10

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('randomize')
    .setDescription('Randomizes and shows the new teams. '),
  args: '',
  requiresActiveSession: true,
  async execute (interaction: CommandInteraction, properties: Properties) {
    if (!interaction.guild) return
    await interaction.deferReply()

    const [firstTeamRoleId, secondTeamRoleId, spectatorRoleId] = await Promise.all([
      properties.firstTeamRoleIds.get(interaction.guild.id),
      properties.secondTeamRoleIds.get(interaction.guild.id),
      properties.spectatorRoleIds.get(interaction.guild.id)
    ])

    const roles = await interaction.guild.roles.fetch()
    await Promise.allSettled(
      clearTeamRoles(roles, firstTeamRoleId, secondTeamRoleId)
    )
    const [lobbyVcId, firstTeamVcId, secondTeamVcId] = await Promise.all([
      properties.lobbies.get(interaction.guild.id),
      properties.firstTeamVcs.get(interaction.guild.id),
      properties.secondTeamVcs.get(interaction.guild.id)
    ])
    const lastRoundSpectatorIds: string[] = await properties.guaranteedPlayersNextRoundIds.get(
      interaction.guild.id
    )
    const lobbyVcMembers: Collection<string, GuildMember> = (interaction.guild.channels.cache
      .get(lobbyVcId)!
      .members as Collection<string, GuildMember>)
      .filter(member => !member.user.bot)
    const guaranteedPlayers: Collection<string, GuildMember> = lobbyVcMembers.filter((member: GuildMember) => lastRoundSpectatorIds.includes(member.id))

    logger.info('==========randomize start==========')
    let playerPool = guaranteedPlayers
      .map((member) => interaction.guild!.members.cache.get(member.id)!)
      .filter((member: GuildMember) => !member.roles.cache.some((role: Role) => role.id === spectatorRoleId))
      .slice(0, MAX_AMOUNT_OF_PLAYERS + 1)
    if (playerPool.length > 0) {
      logger.info(
        `Guaranteed players are: ${playerPool
          .map((player: GuildMember) => player.user.username)
          .join(', ')}.`
      )
    }
    if (playerPool.length === MAX_AMOUNT_OF_PLAYERS) {
      await setNextRoundGuaranteedPlayers(playerPool, lobbyVcMembers, spectatorRoleId, properties, interaction.guild)
    } else if (playerPool.length < MAX_AMOUNT_OF_PLAYERS) {
      playerPool = await fillPlayerPool(
        interaction.guild,
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

    const embeds = createTeamEmbeds(lobbyVcMembers, firstTeamRoleId, secondTeamRoleId, spectatorRoleId, interaction.guild, firstTeamVcId, secondTeamVcId, lobbyVcId)
    logger.info('==========randomize end==========')

    await interaction.editReply({ embeds })
  }
}

async function setNextRoundGuaranteedPlayers (playerPool: GuildMember[], lobbyVcMembers: Collection<string, GuildMember>, spectatorRoleId: any, properties: Properties, guild: Guild): Promise<void> {
  const playerIds = new Set(playerPool.map(player => player.user.id))
  const availablePlayers = lobbyVcMembers.filter(player => !playerPool.includes(player) && !player.roles.cache.has(spectatorRoleId))
  const guaranteedPlayersNextRound = availablePlayers.filter(player => !playerIds.has(player.user.id))

  await properties.guaranteedPlayersNextRoundIds.set(
    guild.id,
    guaranteedPlayersNextRound.map((member: GuildMember) => member.user.id)
  )
  logger.info(
    'Playerpool is filled with last round spectators. Guaranteed players next round: ' +
    guaranteedPlayersNextRound
      .map((player: GuildMember) => player.user.username)
      .join(', ')
  )
}

async function fillPlayerPool (guild: Guild, properties: Properties, playerPool: GuildMember[], lobbyVcId: string): Promise<GuildMember[]> {
  logger.info('Entering fillPlayerPool')
  let resultPlayerPool = []
  const spectatorRoleId = await properties.spectatorRoleIds.get(
    guild.id
  )
  const randomizedPlayers = shuffle([
    ...(guild.channels.cache
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
  await properties.guaranteedPlayersNextRoundIds.set(
    guild.id,
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
  logger.info(`Creating teams with parameters: ${players.map(member => member.user.username)}, ${firstTeamRoleId}, ${secondTeamRoleId}`)

  const promises: Array<Promise<GuildMember>> = []
  const teamSize = players.length / 2

  for (let i = 0; i < teamSize; i++) {
    logger.info(`Adding role with id ${firstTeamRoleId} to member ${players[i].user.username}`)
    promises.push(players[i].roles.add(firstTeamRoleId))
  }
  if (teamSize > 2) {
    for (let i = teamSize; i < players.length; i++) {
      logger.info(`Adding role with id ${secondTeamRoleId} to member ${players[i].user.username}`)
      promises.push(players[i].roles.add(secondTeamRoleId))
    }
  }

  return promises
}
