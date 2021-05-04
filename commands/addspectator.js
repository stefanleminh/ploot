const functions = require('../modules/functions')
const validation = require('../modules/validation')

module.exports = {
  name: 'addspectator',
  aliases: ['as'],
  execute (message, args, client) {
    if (!validation.isActiveSession(client)) {
      message.channel.send('You have not started a session yet! Please run the =newsession command.')
      return
    }
    if (args.length === 0) {
      message.channel.send('Please provide a name to add.')
      return
    }
    const spectators = message.mentions.users

    spectators.forEach((spectator) => {
      functions.addParticipant(spectator, message, client.currentSpectators, 'spectators', client)
    })
  }
}
