exports.run = (client, message, args) => {
  message.channel.send("Active players: " + client.currentPlayers);
  message.channel.send("Spectators: " + client.currentSpectators);
};
