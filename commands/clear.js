exports.run = (client, message, args) => {
  if(client.voiceChannels.length === 0) {
    message.channel.send("You have not started a session yet! Please run the =newsession command.")
    return
  }
  client.currentPlayers = [];
  client.currentSpectators = [];
  message.channel.send("Cleared all lists from participants!");
};
