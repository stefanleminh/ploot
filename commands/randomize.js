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
    await interaction.deferReply()
    logger.info('==========randomize start==========')

    let playerPool = client.lastRoundSpectators.slice(0, 12)
    if (playerPool.length > 0) {
      logger.info(
        'Guaranteed players are: ' +
          playerPool.map(player => player.user.username).join(', ')
      )
    }

    if (playerPool.length !== 12) {
      playerPool = fillPlayerPool(interaction, client, playerPool)
    }
    const randomizedPlayerPool = shuffle(playerPool)
    await Promise.all(createTeams(randomizedPlayerPool, client))

    // Update cache with new roles
    await interaction.guild.members.fetch()

    const firstTeam = interaction.guild.channels.cache
      .get(client.config.lobby)
      .members.filter(member =>
        member.roles.cache.some(role => role.id === client.firstTeamRoleId)
      )
      .map(guildmember => guildmember.user)

    logger.debug(
      'First team is: ' + firstTeam.map(player => player.username).join(', ')
    )

    const secondTeam = interaction.guild.channels.cache
      .get(client.config.lobby)
      .members.filter(member =>
        member.roles.cache.some(role => role.id === client.secondTeamRoleId)
      )
      .map(guildmember => guildmember.user)

    logger.debug(
      'Second team is: ' + secondTeam.map(player => player.username).join(', ')
    )

    const spectatorTeam = interaction.guild.channels.cache
      .get(client.config.lobby)
      .members.filter(
        member =>
          member.roles.cache.every(
            role =>
              role.id === client.spectatorRoleId ||
              (role.id !== client.firstTeamRoleId &&
                role.id !== client.secondTeamRoleId)
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
        interaction.guild.channels.cache.get(client.config.firstTeamVc).name,
        '#000088',
        interaction
      ),
      functions.createEmbed(
        secondTeam,
        interaction.guild.channels.cache.get(client.config.secondTeamVc).name,
        '#fe0000',
        interaction
      ),
      functions.createEmbed(
        spectatorTeam,
        interaction.guild.channels.cache.get(client.config.lobby).name,
        '#ffa500',
        interaction
      )
    ]
    logger.info('==========randomize end==========')

    await interaction.editReply({ embeds: embeds })
  }
}

function fillPlayerPool (interaction, client, playerPool) {
  let resultPlayerPool = []
  const randomizedPlayers = shuffle([
    ...interaction.guild.channels.cache
      .get(client.config.lobby)
      .members.filter(
        player =>
          !playerPool.includes(player) &&
          !player.roles.cache.some(
            role => role.id === client.spectatorRoleId
          ) &&
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
  client.lastRoundSpectators = randomizedPlayers.slice(12 - playerPool.length)
  logger.info(
    'Players that got added to spectators for this round are: ' +
      client.lastRoundSpectators.map(player => player.user.username).join(', ')
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

function createTeams (players, client) {
  logger.info(`Creating teams with parameters: ${players}, ${client}`)
  const promises = []
  const firstTeam = players.slice(0, players.length / 2)

  firstTeam.forEach(member => {
    promises.push(member.roles.add(client.firstTeamRoleId))
  })
  const secondTeam = players.slice(players.length / 2, players.length)

  secondTeam.forEach(member => {
    promises.push(member.roles.add(client.secondTeamRoleId))
  })

  return promises
}
