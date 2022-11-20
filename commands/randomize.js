const functions = require('../modules/functions')
const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')
const MAX_AMOUNT_OF_PLAYERS = 10

module.exports = {
  data: new SlashCommandBuilder()
    .setName('randomize')
    .setDescription('Randomizes and shows the new teams. '),
  args: '',
  requiresActiveSession: true,
  async execute (interaction, client) {
    await interaction.deferReply()
    const firstTeamRoleId = await client.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeamRoleId = await client.secondTeamRoleIds.get(
      interaction.guild.id
    )
    const spectatorRoleId = await client.spectatorRoleIds.get(
      interaction.guild.id
    )

    Promise.all(
      functions.clearTeamRoles(interaction, firstTeamRoleId, secondTeamRoleId)
    )
    const lobbyVcId = await client.lobbies.get(interaction.guild.id)
    const firstTeamVcId = await client.firstTeamVcs.get(interaction.guild.id)
    const secondTeamVcId = await client.secondTeamVcs.get(interaction.guild.id)
    // Filter out whoever is not in VC
    const lastRoundSpectatorIds = await client.lastRoundSpectatorIds.get(
      interaction.guild.id
    )
    const lastRoundSpectatorIdsInLobby = interaction.guild.channels.cache
      .get(lobbyVcId)
      .members.filter(member => lastRoundSpectatorIds.includes(member.id))
      .map(member => member.id)

    logger.info('==========randomize start==========')
    let playerPool = lastRoundSpectatorIdsInLobby
      .map(id => interaction.guild.members.cache.get(id))
      ?.slice(0, MAX_AMOUNT_OF_PLAYERS + 1)
    if (playerPool.length > 0) {
      logger.info(
        `Guaranteed players are: ${playerPool
          .map(player => player.displayName)
          .join(', ')}.`
      )
    }
    if (playerPool.length === MAX_AMOUNT_OF_PLAYERS) {
      const playerPoolIds = playerPool.map(player => player.user.id)
      const availablePlayers = interaction.guild.channels.cache
        .get(lobbyVcId)
        .members.filter(
          player =>
            !playerPool.includes(player) &&
            !player.roles.cache.some(role => role.id === spectatorRoleId) &&
            !player.user.bot
        )
      const remainingLastRoundSpectators = availablePlayers.filter(
        id => !playerPoolIds.includes(id)
      )
      await client.lastRoundSpectatorIds.set(
        interaction.guild.id,
        remainingLastRoundSpectators.map(member => member.user.id)
      )
      logger.info(
        'Playerpool is filled with last round spectators. Guaranteed players next round: ' +
          remainingLastRoundSpectators
            .map(player => player.user.username)
            .join(', ')
      )
    } else if (playerPool.length < MAX_AMOUNT_OF_PLAYERS) {
      playerPool = await fillPlayerPool(
        interaction,
        client,
        playerPool,
        lobbyVcId
      )
    }
    const randomizedPlayerPool = shuffle(playerPool)
    await createTeams(randomizedPlayerPool, firstTeamRoleId, secondTeamRoleId)

    // Update cache with new roles
    await interaction.guild.members.fetch()

    const firstTeam = interaction.guild.channels.cache
      .get(lobbyVcId)
      .members.filter(member =>
        member.roles.cache.some(role => role.id === firstTeamRoleId)
      )
      .map(guildmember => guildmember.user)

    logger.debug(
      'First team is: ' + firstTeam.map(player => player.username).join(', ')
    )

    const secondTeam = interaction.guild.channels.cache
      .get(lobbyVcId)
      .members.filter(member =>
        member.roles.cache.some(role => role.id === secondTeamRoleId)
      )
      .map(guildmember => guildmember.user)

    logger.debug(
      'Second team is: ' + secondTeam.map(player => player.username).join(', ')
    )

    const spectatorTeam = interaction.guild.channels.cache
      .get(lobbyVcId)
      .members.filter(
        member =>
          member.roles.cache.every(
            role =>
              role.id === spectatorRoleId ||
              (role.id !== firstTeamRoleId && role.id !== secondTeamRoleId)
          ) && !member.user.bot
      )
      .map(guildmember => guildmember.user)

    logger.debug(
      'Spectators are: ' +
        spectatorTeam.map(player => player.username).join(', ')
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

async function fillPlayerPool (interaction, client, playerPool, lobbyVcId) {
  logger.info('Entering fillPlayerPool')
  let resultPlayerPool = []
  const spectatorRoleId = await client.spectatorRoleIds.get(
    interaction.guild.id
  )
  const randomizedPlayers = shuffle([
    ...interaction.guild.channels.cache
      .get(lobbyVcId)
      .members.filter(
        player =>
          !playerPool.includes(player) &&
          !player.roles.cache.some(role => role.id === spectatorRoleId) &&
          !player.user.bot
      )
      .values()
  ])
  resultPlayerPool = playerPool.concat(
    randomizedPlayers.slice(0, MAX_AMOUNT_OF_PLAYERS - playerPool.length)
  )
  logger.info(
    'Playerpool is: ' +
      resultPlayerPool.map(player => player.user.username).join(', ')
  )
  // Add rest to spectators
  await client.lastRoundSpectatorIds.set(
    interaction.guild.id,
    randomizedPlayers
      .slice(MAX_AMOUNT_OF_PLAYERS - playerPool.length)
      .map(player => player.user.id)
  )
  logger.info(
    'Players that got added to spectators for this round are: ' +
      randomizedPlayers
        .slice(MAX_AMOUNT_OF_PLAYERS - playerPool.length)
        .map(player => player.user.username)
        .join(', ')
  )
  return resultPlayerPool
}

/**
 * Shuffles array in place.
 * @param {Array} array items An array containing the items.
 */
function shuffle (array) {
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

async function createTeams (players, firstTeamRoleId, secondTeamRoleId) {
  logger.info(
    `Creating teams with parameters: ${players}, ${firstTeamRoleId}, ${secondTeamRoleId}`
  )
  const firstTeamPromises = []
  const firstTeam = players.slice(0, players.length / 2)

  firstTeam.forEach(member => {
    firstTeamPromises.push(member.roles.add(firstTeamRoleId))
  })
  await Promise.all(firstTeamPromises)

  const secondTeamPromises = []
  const secondTeam = players.slice(
    players.length / 2,
    MAX_AMOUNT_OF_PLAYERS + 1
  )

  secondTeam.forEach(member => {
    secondTeamPromises.push(member.roles.add(secondTeamRoleId))
  })
  await Promise.all(secondTeamPromises)

  return Promise.resolve()
}
