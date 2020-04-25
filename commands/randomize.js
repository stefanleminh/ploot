const Discord = require("discord.js");
const functions = require('../modules/functions')

exports.run = (client, message, args) => {
  let randomizedPlayers = shuffle(client.currentPlayers);
  const randomizedPlayerPool = randomizedPlayers.slice(0, 12);
  let teams = createTeams(randomizedPlayerPool);
  let firstTeam = teams[0];
  let secondTeam = teams[1];
  let spectators = client.currentSpectators.concat(randomizedPlayers.slice(12));
  printTeam("Coochiecookers", firstTeam, "#000088", message);
  printTeam("Chanqlas", secondTeam, "#fe0000", message);
  printTeam("Spectators", spectators, "#ffa500", message);
};

/**
 * Shuffles array in place.
 * @param {Array} array items An array containing the items.
 */
function shuffle(array) {
  let j,
    x,
    i,
    result = array.slice();
  for (i = result.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = result[i];
    result[i] = result[j];
    result[j] = x;
  }
  return result;
}

function createTeams(players) {
  let results = [];

  const firstTeam = players.slice(0, players.length / 2);
  const secondTeam = players.slice(players.length / 2, players.length);
  results.push(firstTeam);
  results.push(secondTeam);

  return results;
}

function printTeam(title, team, color, message) {
  if (team.length === 0) {
    return;
  }
  let teamEmbed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(color)
    .setAuthor(`${message.guild.name} 6v6-Event`, message.guild.iconURL)
    .addFields((functions.chunk(team, 6)).map(chunk => {
      return {name: title, value: chunk , inline: true}
    }))

  message.channel.send(teamEmbed);
}
