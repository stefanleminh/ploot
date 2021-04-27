const validation = require('../modules/validation');
exports.run = (client, message) => {
  if (!validation.isActiveSession(client)) {
    message.channel.send('You have not started a session yet! Please run the =newsession command.');
    return;
  }

  client.currentSpectators.forEach((spectator) => {
    const member = message.guild.members.cache.get(spectator.id);
    setVoiceChannel(member, client.voiceChannels[0], message, client);
    client.logger.info('Moved user ' + spectator.username + ' to voice channel ' + client.voiceChannels[0].name);
  });

  client.firstTeam.forEach((player) => {
    const member = message.guild.members.cache.get(player.id);
    setVoiceChannel(member, client.voiceChannels[1], message, client);
    client.logger.info('Moved player ' + player.username + ' to voice channel ' + client.voiceChannels[1].name);
  });

  client.secondTeam.forEach((player) => {
    const member = message.guild.members.cache.get(player.id);
    setVoiceChannel(member, client.voiceChannels[2], message, client);
    client.logger.info('Moved player ' + player.username + ' to voice channel ' + client.voiceChannels[2].name);
  });
};
function setVoiceChannel(member, voiceChannel, message, client) {
  if (member.voice.channel) {
    member.voice.setChannel(voiceChannel);
    client.logger.info('Moved user ' + member.user.username + ' to voice channel ' + voiceChannel.name);
  } else {
    message.channel.send('<@' + member.id + '> is not connected to the lobby and will not be moved.');
  }
}
