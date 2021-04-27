const validation = require('../modules/validation');
exports.run = (client, message, args) => {
  if (!validation.isActiveSession(client)) {
    message.channel.send('You have not started a session yet! Please run the =newsession command.');
    return;
  }
  // Switch mode of Player
  if (args.length === 0) {
    message.channel.send('Please provide a name to add.');
    return;
  }
  let participant = message.mentions.users.first();

  if (client.currentPlayers.includes(participant)) {
    client.currentSpectators.push(participant);
    client.currentPlayers = client.currentPlayers.filter((element) => element != participant);
    client.logger.info('User ' + participant.username + ' is now a spectator');
    message.channel.send('<@' + participant.id + '> is now spectator.');
  } else if (client.currentSpectators.includes(participant)) {
    client.currentPlayers.push(participant);
    client.currentSpectators = client.currentSpectators.filter((element) => element != participant);
    client.logger.info('User ' + participant.username + ' is now an active player');
    message.channel.send('<@' + participant.id + '> is now an active player.');
  } else {
    client.logger.info('User ' + participant.username + ' not found as an active player or spectator');
    message.channel.send('Participant <@' + participant.id + '> not found as active player or spectator.');
  }
};
