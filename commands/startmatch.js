exports.run = (client, message, args) => {
  if (client.voiceChannels.length === 0) {
    message.channel.send(
      "You have not started a session yet! Please run the =newsession command."
    );
    return;
  }
  client.firstTeam.forEach((player) => {
    const member = message.guild.members.cache.get(player.id);
    console.log("Setting member " + member.name + " to VC " + client.voiceChannels[1])
    member.voice.setChannel(client.voiceChannels[1])
  });

  client.secondTeam.forEach((player) => {
    const member = message.guild.members.cache.get(player.id);
    console.log("Setting member " + member.name + " to VC " + client.voiceChannels[2])
    member.voice.setChannel(client.voiceChannels[2])
  });
};
