const functions = require('../modules/functions')
const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('randomize')
    .setDescription('Randomizes and shows the new teams. '),
  args: '',
  requiresActiveSession: true,
  async execute (interaction, client) {
    const firstTeamRoleId = await client.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeamRoleId = await client.secondTeamRoleIds.get(
      interaction.guild.id
    )
    const spectatorRoleId = await client.spectatorRoleIds.get(
      interaction.guild.id
    )
    const lobbyVc = await client.lobbies.get(interaction.guild.id)
    const firstTeamVc = await client.firstTeamVcs.get(interaction.guild.id)
    const secondTeamVc = await client.secondTeamVcs.get(interaction.guild.id)
    await interaction.deferReply()
    logger.info('==========randomize start==========')

    let playerPool = (
      await client.lastRoundSpectators.get(interaction.guild.id)
    ).slice(0, 12)
    if (playerPool.length > 0) {
      logger.info(
        'Guaranteed players are: ' +
          playerPool.map(player => player.user.username).join(', ')
      )
    }

    if (playerPool.length !== 12) {
      playerPool = await fillPlayerPool(
        interaction,
        client,
        playerPool,
        lobbyVc
      )
    }
    const randomizedPlayerPool = shuffle(playerPool)
    const teamPromises = await createTeams(
      randomizedPlayerPool,
      firstTeamRoleId,
      secondTeamRoleId
    )
    await Promise.all(teamPromises)

    // Update cache with new roles
    await interaction.guild.members.fetch()

    const firstTeam = interaction.guild.channels.cache
      .get(lobbyVc)
      .members.filter(member =>
        member.roles.cache.some(role => role.id === firstTeamRoleId)
      )
      .map(guildmember => guildmember.user)

    logger.debug(
      'First team is: ' + firstTeam.map(player => player.username).join(', ')
    )

    const secondTeam = interaction.guild.channels.cache
      .get(lobbyVc)
      .members.filter(member =>
        member.roles.cache.some(role => role.id === secondTeamRoleId)
      )
      .map(guildmember => guildmember.user)

    logger.debug(
      'Second team is: ' + secondTeam.map(player => player.username).join(', ')
    )

    const spectatorTeam = interaction.guild.channels.cache
      .get(lobbyVc)
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
        interaction.guild.channels.cache.get(firstTeamVc).name,
        '#000088',
        interaction
      ),
      functions.createEmbed(
        secondTeam,
        interaction.guild.channels.cache.get(secondTeamVc).name,
        '#fe0000',
        interaction
      ),
      functions.createEmbed(
        spectatorTeam,
        interaction.guild.channels.cache.get(lobbyVc).name,
        '#ffa500',
        interaction
      )
    ]
    logger.info('==========randomize end==========')

    await interaction.editReply({ embeds: embeds })
  }
}

async function fillPlayerPool (interaction, client, playerPool, lobbyVc) {
  let resultPlayerPool = []
  const spectatorRoleId = await client.spectatorRoleIds.get(
    interaction.guild.id
  )
  const randomizedPlayers = shuffle([
    ...interaction.guild.channels.cache
      .get(lobbyVc)
      .members.filter(
        player =>
          !playerPool.includes(player) &&
          !player.roles.cache.some(role => role.id === spectatorRoleId) &&
          !player.user.bot
      )
      .values()
  ])
  resultPlayerPool = playerPool.concat(
    randomizedPlayers.slice(0, 12 - playerPool.length)
  )
  logger.info(
    'Playerpool is: ' +
      resultPlayerPool.map(player => player.user.username).join(', ')
  )
  // Add rest to spectators
  await client.lastRoundSpectators.set(
    interaction.guild.id,
    randomizedPlayers.slice(12 - playerPool.length)
  )
  logger.info(
    'Players that got added to spectators for this round are: ' +
      (await client.lastRoundSpectators.get(interaction.guild.id))
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
  const promises = []
  const firstTeam = players.slice(0, players.length / 2)

  firstTeam.forEach(member => {
    promises.push(member.roles.add(firstTeamRoleId))
  })
  const secondTeam = players.slice(players.length / 2, players.length)

  secondTeam.forEach(member => {
    promises.push(member.roles.add(secondTeamRoleId))
  })

  return promises
}
