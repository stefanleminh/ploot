const validation = require('../modules/validation');
const path = require('path');
const logger = require('../logging/winston')(path.basename(__filename));

exports.run = (client, message) => {
  if (!validation.isActiveSession(client)) {
    message.channel.send('You have not started a session yet! Please run the =newsession command.');
    return;
  }

  client.currentSpectators.forEach((spectator) => {
    const member = message.guild.members.cache.get(spectator.id);
    setVoiceChannel(member, client.voiceChannels[0], message, client);
  });

  client.firstTeam.forEach((player) => {
    const member = message.guild.members.cache.get(player.id);
    setVoiceChannel(member, client.voiceChannels[1], message, client);
  });

  client.secondTeam.forEach((player) => {
    const member = message.guild.members.cache.get(player.id);
    setVoiceChannel(member, client.voiceChannels[2], message, client);
  });
};
function setVoiceChannel(member, voiceChannel, message) {
  if (member.voice.channel) {
    member.voice.setChannel(voiceChannel);
    logger.info(`Moved user ${member.user.username} to voice channel ${voiceChannel.name}`);
  } else {
    logger.info(`User ${member.user.username} is not connected to the lobby and will not be moved.`);
    message.channel.send(`<@${member.id}> is not connected to the lobby and will not be moved.`);
  }
}
