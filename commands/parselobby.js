const functions = require('../modules/functions')

module.exports = {
  name: 'parselobby',
  aliases: ['pl'],
  requiresActiveSession: true,
  execute (message, args, client) {
    message.guild.channels.cache.get(client.config.lobby).members.forEach((member) => {
      functions.addParticipant(member.user, message, client.currentPlayers, 'players')
    })
  }
}
