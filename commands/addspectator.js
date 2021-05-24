const functions = require('../modules/functions')

module.exports = {
  name: 'addspectator',
  aliases: ['as'],
  description: 'Adds one or multiple participants as a spectator.',
  args: '[@DiscordUser] ...',
  requiresActiveSession: true,
  order: 8,
  execute (message, args, client) {
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
