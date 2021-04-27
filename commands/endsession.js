const validation = require('../modules/validation');
const clear = require('./clear');

exports.run = (client, message) => {
  if (!validation.isActiveSession(client)) {
    message.channel.send('You have not started a session yet! Please run the =newsession command.');
    return;
  }
  clear.run(client, message);
  client.voiceChannels = [];
  client.logger.debug('Session ended! Cleared all lists.');
  message.channel.send('Session ended! Cleared all lists.');
};
