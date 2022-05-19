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
    client.firstTeam = []
    client.secondTeam = []
    client.spectatorTeam = []

    const guaranteedPlayers = client.lastRoundSpectators.slice(0, 12)
    logger.info(
      'Guaranteed players are: ' +
        guaranteedPlayers.map((player) => player.username).join(', ')
    )
    // Premake teams only with players that spectated last round
    const guaranteedPlayersTeams = createTeams(guaranteedPlayers)
    logger.debug(
      'First team of guaranteed players: ' +
        guaranteedPlayersTeams[0].map((player) => player.username).join(', ')
    )
    logger.debug(
      'Second team of guaranteed players: ' +
        guaranteedPlayersTeams[1].map((player) => player.username).join(', ')
    )

    // Create teams with remaining players
    const randomizedPlayers = shuffle(
      client.currentPlayers.filter(
        (player) => !guaranteedPlayers.includes(player)
      )
    )
    const randomizedPlayerPool = randomizedPlayers.slice(0, 12)
    logger.info(
      'Remaining pool of players consists of: ' +
        randomizedPlayerPool.map((player) => player.username).join(', ')
    )
    const playerTeams = createTeams(randomizedPlayerPool)

    // Fill up prefilled teams with remaining player teams
    client.firstTeam = guaranteedPlayersTeams[0].concat(
      playerTeams[0].slice(0, 6 - guaranteedPlayersTeams[0].length)
    )
    client.lastRoundSpectators = playerTeams[0].slice(
      6 - guaranteedPlayersTeams[0].length
    )
    logger.debug(
      'First team: ' +
        client.firstTeam.map((player) => player.username).join(', ')
    )
    logger.debug(
      'Added players from first pool to spectator-list: ' +
        playerTeams[0]
          .slice(6 - guaranteedPlayersTeams[0].length)
          .map((player) => player.username)
          .join(', ')
    )

    client.secondTeam = guaranteedPlayersTeams[1].concat(
      playerTeams[1].slice(0, 6 - guaranteedPlayersTeams[1].length)
    )
    client.lastRoundSpectators = client.lastRoundSpectators.concat(
      playerTeams[1].slice(6 - guaranteedPlayersTeams[1].length)
    )
    logger.debug(
      'Second team: ' +
        client.secondTeam.map((player) => player.username).join(', ')
    )
    logger.debug(
      'Added players from second pool to spectator-list: ' +
        playerTeams[1]
          .slice(6 - guaranteedPlayersTeams[1].length)
          .map((player) => player.username)
          .join(', ')
    )

    client.lastRoundSpectators = client.lastRoundSpectators.concat(
      randomizedPlayers.slice(12)
    )
    logger.debug(
      'Added players outside of pool to spectator-list: ' +
        randomizedPlayers
          .slice(12)
          .map((player) => player.username)
          .join(', ')
    )
    client.spectatorTeam = client.currentSpectators.concat(
      client.lastRoundSpectators
    )
    logger.debug(
      'Players that are not playing this round: ' +
        client.lastRoundSpectators.map((player) => player.username).join(', ')
    )

    logger.debug(
      'First team is: ' +
        client.firstTeam.map((player) => player.username).join(', ')
    )
    logger.debug(
      'Second team is: ' +
        client.secondTeam.map((player) => player.username).join(', ')
    )
    logger.debug(
      'Spectators are: ' +
        client.spectatorTeam.map((player) => player.username).join(', ')
    )
    const embeds = []
    embeds.push(
      functions.createEmbed(
        client.firstTeam,
        client.voiceChannels[1].name,
        '#000088',
        interaction
      ),
      functions.createEmbed(
        client.secondTeam,
        client.voiceChannels[2].name,
        '#fe0000',
        interaction
      ),
      functions.createEmbed(
        client.spectatorTeam,
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

function createTeams (players) {
  const results = []

  const firstTeam = players.slice(0, players.length / 2)
  const secondTeam = players.slice(players.length / 2, players.length)
  results.push(firstTeam)
  results.push(secondTeam)

  return results
}
