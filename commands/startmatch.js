const functions = require('../modules/functions')
exports.run = (client, message, args) => {
  if (client.voiceChannels.length === 0) {
    message.channel.send(
      "You have not started a session yet! Please run the =newsession command."
    );
    return;
  }

  client.currentSpectators.forEach(spectator => {
    const member = message.guild.members.cache.get(spectator.id);
    setVoiceChannel(member, client.voiceChannels[0], message);
  })

  client.firstTeam.forEach((player) => {
    const member = message.guild.members.cache.get(player.id);
    setVoiceChannel(member, client.voiceChannels[1], message);
  });

  client.secondTeam.forEach((player) => {
    const member = message.guild.members.cache.get(player.id);
    setVoiceChannel(member, client.voiceChannels[2], message);
    
  });
};
function setVoiceChannel(member, voiceChannel, message) {
  if (member.voice.channel) {
    member.voice.setChannel(voiceChannel);
  } else {
    message.channel.send("<@" + member.id + "> is not connected to the lobby and will not be moved.");
  }
}

