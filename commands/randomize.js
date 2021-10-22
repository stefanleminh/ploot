const Discord = require('discord.js')
const functions = require('../modules/functions')
const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

module.exports = {
  name: 'randomize',
  aliases: ['r'],
  description: 'Randomizes and shows the new teams. Will purge any users not connected to the lobby.',
  args: '',
  requiresActiveSession: true,
  execute (message, args, client) {
    logger.info('==========randomize start==========')
    functions.purge(client, message)
    client.firstTeam = []
    client.secondTeam = []
    client.spectatorTeam = []

    const guaranteedPlayers = client.lastRoundSpectators
    logger.info('Guaranteed players are: ' + guaranteedPlayers.map((player) => player.username).join(', '))
    // Premake teams only with players that spectated last round
    const guaranteedPlayersTeams = createTeams(guaranteedPlayers)
    logger.debug('First team of guaranteed players: ' + guaranteedPlayersTeams[0].map((player) => player.username).join(', '))
    logger.debug('Second team of guaranteed players: ' + guaranteedPlayersTeams[1].map((player) => player.username).join(', '))

    // Create teams with remaining players
    const randomizedPlayers = shuffle(client.currentPlayers.filter((player) => !guaranteedPlayers.includes(player)))
    const randomizedPlayerPool = randomizedPlayers.slice(0, 12)
    logger.info(
      'Remaining pool of players consists of: ' + randomizedPlayerPool.map((player) => player.username).join(', ')
    )
    const playerTeams = createTeams(randomizedPlayerPool)

    // Fill up prefilled teams with remaining player teams
    client.firstTeam = guaranteedPlayersTeams[0].concat(playerTeams[0].slice(0, 6 - guaranteedPlayersTeams[0].length))
    client.lastRoundSpectators = playerTeams[0].slice(6 - guaranteedPlayersTeams[0].length)
    logger.debug('First team: ' + client.firstTeam.map((player) => player.username).join(', '))
    logger.debug('Added players from first pool to spectator-list: ' + playerTeams[0].slice(6 - guaranteedPlayersTeams[0].length).map((player) => player.username).join(', '))

    client.secondTeam = guaranteedPlayersTeams[1].concat(playerTeams[1].slice(0, 6 - guaranteedPlayersTeams[1].length))
    client.lastRoundSpectators = client.lastRoundSpectators.concat(playerTeams[1].slice(6 - guaranteedPlayersTeams[1].length))
    logger.debug('Second team: ' + client.secondTeam.map((player) => player.username).join(', '))
    logger.debug('Added players from second pool to spectator-list: ' + playerTeams[1].slice(6 - guaranteedPlayersTeams[1].length).map((player) => player.username).join(', '))

    client.lastRoundSpectators = client.lastRoundSpectators.concat(randomizedPlayers.slice(12))
    logger.debug('Added players outside of pool to spectator-list: ' + randomizedPlayers.slice(12).map((player) => player.username).join(', '))
    client.spectatorTeam = client.currentSpectators.concat(client.lastRoundSpectators)
    logger.debug('Players that are not playing this round: ' + client.lastRoundSpectators.map((player) => player.username).join(', '))

    logger.debug('First team is: ' + client.firstTeam.map((player) => player.username).join(', '))
    printTeam(client.voiceChannels[1].name, client.firstTeam, '#000088', message)
    logger.debug('Second team is: ' + client.secondTeam.map((player) => player.username).join(', '))
    printTeam(client.voiceChannels[2].name, client.secondTeam, '#fe0000', message)
    logger.debug('Spectators are: ' + client.spectatorTeam.map((player) => player.username).join(', '))
    printTeam(client.voiceChannels[0].name, client.spectatorTeam, '#ffa500', message)
    logger.info('==========randomize end==========')
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

function printTeam (title, team, color, message) {
  if (team.length === 0) {
    return
  }
  const teamEmbed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(color)
    .setAuthor(`${message.guild.name} 6v6-Event`, message.guild.iconURL)
    .addFields(
      functions.chunk(team, 6).map((chunk) => {
        return { name: title, value: chunk, inline: true }
      })
    )

  message.channel.send(teamEmbed)
}
