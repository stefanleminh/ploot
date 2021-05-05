const Discord = require('discord.js')

module.exports = {
  name: 'help',
  aliases: ['h'],
  description: 'Shows this help message.',
  args: '',
  order: 1,
  execute (message, args, client) {
    const sortedCommands = message.client.commands.sort(({ order: a }, { order: b }) => (a - b))
    const helpEmbed = new Discord.MessageEmbed()
      .setTitle('Help')
      .setColor('#B1F7AA')
      .setAuthor(`${message.guild.name} 6v6-Event`, message.guild.iconURL)

    sortedCommands.forEach((command) => {
      helpEmbed.addField(`${client.config.prefix}${command.name} ${command.args}`, `${command.description}`)
    })

    message.channel.send(helpEmbed)
  }
}
