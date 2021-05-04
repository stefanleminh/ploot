const validation = require('../modules/validation');
const path = require('path');
const logger = require('../logging/winston')(path.basename(__filename));

exports.run = (client, message) => {
  if (!validation.isActiveSession(client)) {
    message.channel.send('You have not started a session yet! Please run the =newsession command.');
    return;
  }
  client.currentPlayers = [];
  client.currentSpectators = [];
  client.firstTeam = [];
  client.secondTeam = [];
  client.lastRoundSpectators = [];
  logger.debug('Cleared all lists from participants!');
  message.channel.send('Cleared all lists from participants!');
};
