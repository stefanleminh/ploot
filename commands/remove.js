exports.run = (client, message, args) => {
  if (args.length === 0) {
    message.channel.send("Please provide a name to add.");
    return;
  }
  args.forEach((participant) => {
    if (client.currentPlayers.includes(participant)) {
      client.currentPlayers = client.currentPlayers.filter(
        (player) => player != participant
      );
      message.channel.send(
        "Removed participant " +
          participant +
          " from the list of current players."
      );
    } else if (client.currentSpectators.includes(participant)) {
      client.currentSpectators = client.currentSpectators.filter(
        (spectator) => spectator != participant
      );
      message.channel.send(
        "Removed participant " + participant + " from spectator list."
      );
    } else {
      message.channel.send(
        "Participant " +
          participant +
          " not found as active player or spectator"
      );
      return;
    }
  });
};
