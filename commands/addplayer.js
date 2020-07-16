const functions = require('../modules/functions')

exports.run = (client, message, args) => {
  if (args.length === 0) {
    message.channel.send("Please provide a name to add.");
    return;
  }
  let players = message.mentions.users

  players.forEach((player) => {
    functions.addParticipant(player, message, client.currentPlayers, "players");
  });
};
