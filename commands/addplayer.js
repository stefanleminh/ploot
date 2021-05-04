const functions = require('../modules/functions')
const validation = require('../modules/validation')

module.exports = {
  name: 'addplayer',
  aliases: ['ap'],
  execute (message, args, client) {
    if (!validation.isActiveSession(client)) {
      message.channel.send('You have not started a session yet! Please run the =newsession command.')
      return
    }
    if (args.length === 0) {
      message.channel.send('Please provide a name to add.')
      return
    }

    const players = message.mentions.users

    players.forEach((player) => {
      functions.addParticipant(player, message, client.currentPlayers, 'players')
    })
  }
}
