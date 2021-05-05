const Discord = require('discord.js')
const functions = require('../modules/functions')
const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

module.exports = {
  name: 'randomize',
  aliases: ['r'],
  description: 'Randomizes and shows the new teams. Will purge any users not connected to the lobby.',
  args: '',
  order: 11,
  execute (message, args, client) {
    if (client.voiceChannels.length === 0) {
      message.channel.send('You have not started a session yet! Please run the =newsession command.')
      return
    }
    functions.purge(client, message)
    client.firstTeam = []
    client.secondTeam = []
    client.spectatorTeam = []

    const guaranteedPlayers = client.lastRoundSpectators
    logger.info('Guaranteed player teams are: ' + guaranteedPlayers.map((player) => player.username).join(', '))
    const guaranteedPlayersTeams = createTeams(guaranteedPlayers.filter((el) => !guaranteedPlayers.includes(el)))

    const randomizedPlayers = shuffle(client.currentPlayers)
    const randomizedPlayerPool = randomizedPlayers.slice(0, 12)
    logger.info(
      'Remaining pool of players consists of: ' + randomizedPlayerPool.map((player) => player.username).join(', ')
    )
    const playerTeams = createTeams(randomizedPlayerPool)

    client.firstTeam = guaranteedPlayersTeams[0].concat(playerTeams[0].slice(0, 6 - guaranteedPlayersTeams[0].length))
    logger.debug('First team: ' + client.firstTeam.map((player) => player.username).join(', '))
    client.secondTeam = guaranteedPlayersTeams[1].concat(playerTeams[1].slice(0, 6 - guaranteedPlayersTeams[1].length))
    logger.debug('Second team: ' + client.secondTeam.map((player) => player.username).join(', '))
    client.spectatorTeam = client.currentSpectators.concat(randomizedPlayers.slice(12))
    logger.debug('Spectators: ' + client.spectatorTeam.map((player) => player.username).join(', '))
    printTeam(client.voiceChannels[1].name, client.firstTeam, '#000088', message)
    printTeam(client.voiceChannels[2].name, client.secondTeam, '#fe0000', message)
    printTeam(client.voiceChannels[0].name, client.spectatorTeam, '#ffa500', message)
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
