exports.run = (client, message, args) => {
  // Switch mode of Player
  if (args.length === 0) {
    message.channel.send("Please provide a name to add.");
    return;
  }
  let participant = args[0];

  if (client.currentPlayers.includes(participant)) {
    client.currentSpectators.push(participant);
    client.currentPlayers = client.currentPlayers.filter(
      (element) => element != participant
    );
    message.channel.send(participant + " is now spectator.");
  } else if (client.currentSpectators.includes(participant)) {
    client.currentPlayers.push(participant);
    client.currentSpectators = client.currentSpectators.filter(
      (element) => element != participant
    );
    message.channel.send(participant + " is now an active player.");
  } else {
    message.channel.send(
      "Participant `" +
        participant +
        "` not found as active player or spectator."
    );
  }
};
