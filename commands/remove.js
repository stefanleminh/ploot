const validation = require('../modules/validation');
exports.run = (client, message, args) => {
  if (!validation.isActiveSession(client)) {
    message.channel.send('You have not started a session yet! Please run the =newsession command.');
    return;
  }
  if (args.length === 0) {
    message.channel.send('Please provide a name to remove.');
    return;
  }
  let participants = message.mentions.users;
  participants.forEach((participant) => {
    if (client.currentPlayers.includes(participant)) {
      client.currentPlayers = client.currentPlayers.filter((player) => player != participant);
      message.channel.send('Removed participant <@' + participant.id + '> from the list of current players.');
      client.logger.debug('Removed participant ' + participant.username + ' from the list of current players.');
    } else if (client.currentSpectators.includes(participant)) {
      client.currentSpectators = client.currentSpectators.filter((spectator) => spectator != participant);
      message.channel.send('Removed participant <@' + participant.id + '> from spectator list.');
      client.logger.debug('Removed participant ' + participant.username + ' from spectator list.');
    } else {
      message.channel.send('Participant <@' + participant.id + '> not found as active player or spectator');
      client.logger.debug('Participant ' + participant.username + ' not found as active player or spectator.');
      return;
    }
  });
};
