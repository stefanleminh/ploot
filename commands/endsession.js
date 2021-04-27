const validation = require('../modules/validation');

exports.run = (client, message) => {
  if (!validation.isActiveSession(client)) {
    message.channel.send('You have not started a session yet! Please run the =newsession command.');
    return;
  }
  client.currentPlayers = [];
  client.currentSpectators = [];
  client.voiceChannels = [];
  client.firstTeam = [];
  client.secondTeam = [];
  client.lastRoundSpectators = [];

  message.channel.send('Session ended! Cleared all lists.');
};
