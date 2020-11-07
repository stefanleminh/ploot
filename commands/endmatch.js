exports.run = (client, message, args) => {
    if (client.voiceChannels.length === 0) {
      message.channel.send(
        "You have not started a session yet! Please run the =newsession command."
      );
      return;
    }

    client.voiceChannels[1].members.foreach((player) => {
      const member = message.guild.members.cache.get(player.id);
      member.voice.setChannel(client.voiceChannels[0])
    });

    client.voiceChannels[2].members.foreach((player) => {
      const member = message.guild.members.cache.get(player.id);
      member.voice.setChannel(client.voiceChannels[0])
    });
  
  };
  