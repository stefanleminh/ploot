const validation = require('../modules/validation')
const clear = require('./clear')
const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

module.exports = {
  name: 'endsession',
  aliases: ['es'],
  execute (message, args, client) {
    if (!validation.isActiveSession(client)) {
      message.channel.send('You have not started a session yet! Please run the =newsession command.')
      return
    }
    clear.execute(message, args, client)
    client.voiceChannels = []
    logger.debug('Session ended! Cleared all lists.')
    message.channel.send('Session ended! Cleared all lists.')
  }
}
