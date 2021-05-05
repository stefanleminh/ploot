const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

module.exports = {
  name: 'clear',
  aliases: ['c'],
  description: 'Clears active players and spectators list.',
  args: '',
  requiresActiveSession: true,
  order: 12,
  execute (message, args, client) {
    client.currentPlayers = []
    client.currentSpectators = []
    client.firstTeam = []
    client.secondTeam = []
    client.lastRoundSpectators = []
    logger.debug('Cleared all lists from participants!')
    message.channel.send('Cleared all lists from participants!')
  }
}
