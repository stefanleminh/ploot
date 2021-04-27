const functions = require('../modules/functions');
const validation = require('../modules/validation');

exports.run = (client, message, args) => {
  if (!validation.isActiveSession(client)) {
    message.channel.send('You have not started a session yet! Please run the =newsession command.');
    return;
  }
  if (args.length === 0) {
    message.channel.send('Please provide a name to add.');
    return;
  }
  let spectators = message.mentions.users;

  spectators.forEach((spectator) => {
    functions.addParticipant(spectator, message, client.currentSpectators, 'spectators');
  });
};
