const functions = require('../modules/functions')
const Discord = require('discord.js')

module.exports = {
  name: 'list',
  aliases: ['l'],
  description: 'Lists active players and spectators.',
  args: '',
  requiresActiveSession: true,
  order: 6,
  execute (message, args, client) {
    printList(client.currentPlayers, 'Players', '#000088', message)
    printList(client.currentSpectators, 'Spectators', '#fe0000', message)
  }
}

function printList (list, title, color, message) {
  const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(color)
    .setAuthor(`${message.guild.name} 6v6-Event`, message.guild.iconURL)
    .addFields(
      functions.chunk(list, 6).map((chunk) => {
        return { name: title, value: chunk, inline: true }
      })
    )

  message.channel.send(embed)
}
