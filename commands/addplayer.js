const functions = require('../modules/functions')

module.exports = {
  name: 'addplayer',
  aliases: ['ap'],
  description: 'Adds one or multiple participants to the active players.',
  args: '[@DiscordUser] ...',
  requiresActiveSession: true,
  execute (message, args, client) {
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
