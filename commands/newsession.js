exports.run = (client, message, args) => {
  if (args.length != 3) {
    message.channel.send("Please provide three channel names.");
    return;
  }
  args.forEach((channelName) => {
    const channel = message.guild.channels.cache.find(channel => channel.name.includes(channelName) && channel.type === "voice");

    if(channel === undefined) {
      message.channel.send(
        "Channel " + channelName + " does not exist!"
      );
      return;
    }
    if(client.voiceChannels.some(channel => channel.name === channelName)) {
      message.channel.send(
        "Channel " + channelName + " is already on the list!"
      );
    }
    client.voiceChannels.push(channel);
  });
  if(client.voiceChannels.length != 3) {
    message.channel.send("Unable to add channels to start a session! Please try again or check the help command.")
  }
  message.channel.send("New session has been created! " + client.voiceChannels[0].name + " is the General Lobby. " + client.voiceChannels[1].name + " is the first team's lobby. " + client.voiceChannels[2].name + " is the second team's lobby. " + "You can now add users.")
};
