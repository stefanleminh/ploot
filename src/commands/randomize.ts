import { Properties } from "../types/properties"

const functions = require('../modules/functions')
import path from 'path'
import {logging} from '../logging/winston'
const logger = logging(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')
const MAX_AMOUNT_OF_PLAYERS = 10

module.exports = {
  data: new SlashCommandBuilder()
    .setName('randomize')
    .setDescription('Randomizes and shows the new teams. '),
  args: '',
  requiresActiveSession: true,
  async execute (interaction: any, properties: Properties) {
    await interaction.deferReply()
    const firstTeamRoleId = await properties.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeamRoleId = await properties.secondTeamRoleIds.get(
      interaction.guild.id
    )
    const spectatorRoleId = await properties.spectatorRoleIds.get(
      interaction.guild.id
    )

    await Promise.all(
      functions.clearTeamRoles(interaction, firstTeamRoleId, secondTeamRoleId)
    )
    const lobbyVcId = await properties.lobbies.get(interaction.guild.id)
    const firstTeamVcId = await properties.firstTeamVcs.get(interaction.guild.id)
    const secondTeamVcId = await properties.secondTeamVcs.get(interaction.guild.id)
    // Filter out whoever is not in VC
    const lastRoundSpectatorIds = await properties.lastRoundSpectatorIds.get(
      interaction.guild.id
    )
    const lastRoundSpectatorIdsInLobby = interaction.guild.channels.cache
      .get(lobbyVcId)
      .members.filter((member: any) => lastRoundSpectatorIds.includes(member.id))
      .map((member: any) => member.id)

    logger.info('==========randomize start==========')
    let playerPool = lastRoundSpectatorIdsInLobby
      .map((id: any) => interaction.guild.members.cache.get(id))
      ?.slice(0, MAX_AMOUNT_OF_PLAYERS + 1)
    if (playerPool.length > 0) {
      logger.info(
        `Guaranteed players are: ${playerPool
          .map((player: any) => player.displayName)
          .join(', ')}.`
      )
    }
    if (playerPool.length === MAX_AMOUNT_OF_PLAYERS) {
      const playerPoolIds = playerPool.map((player: any) => player.user.id)
      const availablePlayers = interaction.guild.channels.cache
        .get(lobbyVcId)
        .members.filter(
          (player: any) => !playerPool.includes(player) &&
          !player.roles.cache.some((role: any) => role.id === spectatorRoleId) &&
          !player.user.bot
        )
      const remainingLastRoundSpectators = availablePlayers.filter(
        (id: any) => !playerPoolIds.includes(id)
      )
      await properties.lastRoundSpectatorIds.set(
        interaction.guild.id,
        remainingLastRoundSpectators.map((member: any) => member.user.id)
      )
      logger.info(
        'Playerpool is filled with last round spectators. Guaranteed players next round: ' +
          remainingLastRoundSpectators
            .map((player: any) => player.user.username)
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
    await Promise.all(
      createTeams(randomizedPlayerPool, firstTeamRoleId, secondTeamRoleId)
    )

    // Update cache with new roles
    await interaction.guild.members.fetch()

    const firstTeam = interaction.guild.channels.cache
      .get(lobbyVcId)
      .members.filter((member: any) => member.roles.cache.some((role: any) => role.id === firstTeamRoleId)
      )
      .map((guildmember: any) => guildmember.user)

    logger.debug(
      'First team is: ' + firstTeam.map((player: any) => player.username).join(', ')
    )

    const secondTeam = interaction.guild.channels.cache
      .get(lobbyVcId)
      .members.filter((member: any) => member.roles.cache.some((role: any) => role.id === secondTeamRoleId)
      )
      .map((guildmember: any) => guildmember.user)

    logger.debug(
      'Second team is: ' + secondTeam.map((player: any) => player.username).join(', ')
    )

    const spectatorTeam = interaction.guild.channels.cache
      .get(lobbyVcId)
      .members.filter(
        (member: any) => member.roles.cache.every(
          (role: any) => role.id === spectatorRoleId ||
          (role.id !== firstTeamRoleId && role.id !== secondTeamRoleId)
        ) && !member.user.bot
      )
      .map((guildmember: any) => guildmember.user)

    logger.debug(
      'Spectators are: ' +
        spectatorTeam.map((player: any) => player.username).join(', ')
    )

    const embeds = [
      functions.createEmbed(
        firstTeam,
        interaction.guild.channels.cache.get(firstTeamVcId).name,
        '#000088',
        interaction
      ),
      functions.createEmbed(
        secondTeam,
        interaction.guild.channels.cache.get(secondTeamVcId).name,
        '#fe0000',
        interaction
      ),
      functions.createEmbed(
        spectatorTeam,
        interaction.guild.channels.cache.get(lobbyVcId).name,
        '#ffa500',
        interaction
      )
    ]
    logger.info('==========randomize end==========')

    await interaction.editReply({ embeds: embeds })
  }
}

async function fillPlayerPool (interaction: any, properties: Properties, playerPool: any, lobbyVcId: any) {
  logger.info('Entering fillPlayerPool')
  let resultPlayerPool = []
  const spectatorRoleId = await properties.spectatorRoleIds.get(
    interaction.guild.id
  )
  const randomizedPlayers = shuffle([
    ...interaction.guild.channels.cache
      .get(lobbyVcId)
      .members.filter(
        (player: any) => !playerPool.includes(player) &&
        !player.roles.cache.some((role: any) => role.id === spectatorRoleId) &&
        !player.user.bot
      )
      .values()
  ])
  resultPlayerPool = playerPool.concat(
    randomizedPlayers.slice(0, MAX_AMOUNT_OF_PLAYERS - playerPool.length)
  )
  logger.info(
    'Playerpool is: ' +
      resultPlayerPool.map((player: any) => player.user.username).join(', ')
  )
  // Add rest to spectators
  await properties.lastRoundSpectatorIds.set(
    interaction.guild.id,
    randomizedPlayers
      .slice(MAX_AMOUNT_OF_PLAYERS - playerPool.length)
      .map((player: any) => player.user.id)
  )
  logger.info(
    'Players that got added to spectators for this round are: ' +
      randomizedPlayers
        .slice(MAX_AMOUNT_OF_PLAYERS - playerPool.length)
        .map((player: any) => player.user.username)
        .join(', ')
  )
  return resultPlayerPool
}

/**
 * Shuffles array in place.
 * @param {Array} array items An array containing the items.
 */
function shuffle (array: any) {
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

function createTeams (players: any, firstTeamRoleId: any, secondTeamRoleId: any) {
  logger.info(
    `Creating teams with parameters: ${players}, ${firstTeamRoleId}, ${secondTeamRoleId}`
  )
  const promises: any = []
  const firstTeam = players.slice(0, players.length / 2)

  firstTeam.forEach((member: any) => {
    promises.push(member.roles.add(firstTeamRoleId))
  })
  const secondTeam = players.slice(players.length / 2, players.length)

  secondTeam.forEach((member: any) => {
    promises.push(member.roles.add(secondTeamRoleId))
  })

  return promises
}
