exports.run = (client, message, args) => {
  // Debug Command

  var currentPlayers = client.currentPlayers;

  currentPlayers.push("Player1");
  currentPlayers.push("Player2");
  currentPlayers.push("Player3");
  currentPlayers.push("Player4");
  currentPlayers.push("Player5");
  currentPlayers.push("Player6");
  currentPlayers.push("Player7");
  currentPlayers.push("Player8");
  currentPlayers.push("Player9");
  currentPlayers.push("Player10");
  currentPlayers.push("Player11");
  currentPlayers.push("Player12");
  message.channel.send("Added players to list of current players!");
};
