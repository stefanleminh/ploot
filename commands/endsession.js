const clear = require('./clear')
const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

module.exports = {
  name: 'endsession',
  aliases: ['es'],
  description: 'Ends the session and clears all the data.',
  args: '',
  requiresActiveSession: true,
  execute (message, args, client) {
    clear.execute(message, args, client)
    client.voiceChannels = []
    logger.debug('Session ended! Cleared all lists.')
    message.channel.send('Session ended! Cleared all lists.')
  }
}
