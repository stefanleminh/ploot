exports.run = (client, message, args) => {
  if (client.voiceChannels.length === 0) {
    message.channel.send(
      "You have not started a session yet! Please run the =newsession command."
    );
    return;
  }
  client.currentSpectators.forEach(spectator => {
    const member = message.guild.members.cache.get(spectator.id);
    member.voice.setChannel(client.voiceChannels[0])
  })

  client.firstTeam.forEach((player) => {
    const member = message.guild.members.cache.get(player.id);
    member.voice.setChannel(client.voiceChannels[1])
  });

  client.secondTeam.forEach((player) => {
    const member = message.guild.members.cache.get(player.id);
    member.voice.setChannel(client.voiceChannels[2])
  });
};
