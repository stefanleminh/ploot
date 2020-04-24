exports.run = (client, message, args) => {
  client.currentPlayers = [];
  client.currentSpectators = [];
  message.channel.send("Cleared all lists from participants!");
};
