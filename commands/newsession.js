const validation = require('../modules/validation');
const path = require('path');
const logger = require('../logging/winston')(path.basename(__filename));

exports.run = (client, message) => {
  if (validation.isActiveSession(client)) {
    message.channel.send(
      "There's already a session running! Please run =endsession first before starting a new session."
    );
    return;
  }

  client.voiceChannels.push(message.guild.channels.cache.get(client.config.lobby));
  client.voiceChannels.push(message.guild.channels.cache.get(client.config.firstTeamVc));
  client.voiceChannels.push(message.guild.channels.cache.get(client.config.secondTeamVc));
  logger.info(
    'Adding following channels to the list: ' +
      message.guild.channels.cache.get(client.config.lobby).name +
      ', ' +
      message.guild.channels.cache.get(client.config.firstTeamVc).name +
      ', ' +
      message.guild.channels.cache.get(client.config.secondTeamVc).name
  );
  if (!validation.isActiveSession(client)) {
    message.channel.send('Unable to add channels to start a session! Please try again or check the help command.');
    client.voiceChannels = [];
    return;
  }

  message.channel.send(
    'New session has been created! `' +
      client.voiceChannels[0].name +
      "` is the general/spectator's lobby. `" +
      client.voiceChannels[1].name +
      "` is the first team's lobby. `" +
      client.voiceChannels[2].name +
      "` is the second team's lobby. You can now add users."
  );
};
