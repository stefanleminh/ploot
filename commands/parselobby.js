const functions = require('../modules/functions')

module.exports = {
  name: 'parselobby',
  aliases: ['pl'],
  description: 'Adds every user in the lobby to the list of active players',
  args: '',
  requiresActiveSession: true,
  execute (message, args, client) {
    message.guild.channels.cache.get(client.config.lobby).members.forEach((member) => {
      if (!client.currentSpectators.includes(member.user)) {
        functions.addParticipant(member.user, message, client.currentPlayers, 'players')
      }
    })
  }
}
