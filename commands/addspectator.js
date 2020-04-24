const functions = require('../modules/functions')

exports.run = (client, message, args) => {
  if (args.length === 0) {
    message.channel.send("Please provide a name to add.");
    return;
  }
  args.forEach((spectator) => {
    functions.addParticipant(spectator, message, client.currentSpectators, "spectators");
  });
};