const functions = require('../modules/functions')
const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('randomize')
    .setDescription(
      'Randomizes and shows the new teams. Will purge any users not connected to the lobby.'
    ),
  args: '',
  requiresActiveSession: true,
  async execute (interaction, client) {
    logger.info('==========randomize start==========')
    functions.purge(client, interaction)

    let playerPool = client.lastRoundSpectators.slice(0, 12)
    logger.info(
      'Guaranteed players are: ' +
        playerPool.map(player => player.username).join(', ')
    )

    if (playerPool.length !== 12) {
      // fillup
      const randomizedPlayers = shuffle(
        Array.from(
          interaction.guild.channels.cache
            .get(client.config.lobby)
            .members.filter(
              player =>
                !playerPool.includes(player) &&
                !player.roles.cache.some(
                  role => role.id === client.spectatorRoleId
                )
            )
            .values()
        )
      )
      playerPool = playerPool.concat(
        randomizedPlayers.slice(0, 12 - playerPool.length)
      )
      logger.info(
        'Playerpool is: ' + playerPool.map(player => player.username).join(', ')
      )
      client.lastRoundSpectators = randomizedPlayers.slice(
        12 - playerPool.length
      )
      logger.info(
        'Players that got added to spectators for this round are: ' +
          client.lastRoundSpectators.map(player => player.username).join(', ')
      )
    }
    await Promise.all(createTeams(playerPool, client))

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
      .members.filter(async member => {
        member.roles.cache.some(role => role.id === client.secondTeamRoleId)
      })
      .map(guildmember => guildmember.user)
    logger.debug(
      'Second team is: ' + secondTeam.map(player => player.username).join(', ')
    )

    const spectatorTeam = interaction.guild.channels.cache
      .get(client.config.lobby)
      .members.filter(member =>
        member.roles.cache.some(role => role.id === client.spectatorRoleId)
      )
      .map(guildmember => guildmember.user)

    logger.debug(
      'Spectators are: ' +
        spectatorTeam.map(player => player.username).join(', ')
    )
    const embeds = []
    embeds.push(
      functions.createEmbed(
        firstTeam,
        client.voiceChannels[1].name,
        '#000088',
        interaction
      ),
      functions.createEmbed(
        secondTeam,
        client.voiceChannels[2].name,
        '#fe0000',
        interaction
      ),
      functions.createEmbed(
        spectatorTeam,
        client.voiceChannels[0].name,
        '#ffa500',
        interaction
      )
    )
    logger.info('==========randomize end==========')

    await interaction.reply({ embeds: embeds })
  }
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
  // const results = []
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
  // results.push(firstTeam)
  // results.push(secondTeam)
  console.log('Returning promises')
  return promises
  // return results
}
