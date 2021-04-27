exports.run = (client, message, args) => {
  if (client.voiceChannels.length === 0) {
    message.channel.send('You have not started a session yet! Please run the =newsession command.');
    return;
  }

  if (client.voiceChannels[1].members.size > 0) {
    client.voiceChannels[1].members.array().forEach((player) => {
      player.voice.setChannel(client.voiceChannels[0]);
    });
  }

  if (client.voiceChannels[2].members.size > 0) {
    client.voiceChannels[2].members.array().forEach((player) => {
      player.voice.setChannel(client.voiceChannels[0]);
    });
  }
};
