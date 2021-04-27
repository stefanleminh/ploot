const path = require('path');
const logger = require('../logging/winston')(path.basename(__filename));

module.exports = (client, message) => {
  if (!message.content.startsWith(client.config.prefix) || message.author.bot) {
    return;
  }

  // Our standard argument/command name definition.
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  logger.debug('Received command: ' + command);

  // Grab the command data from the client.commands collection
  const cmd = client.commands.get(command);

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) {
    logger.debug('Command not found: ' + command);
    return;
  }

  // Run the command
  logger.info('Running command: [' + command + '] with following args: [' + args + ']');
  cmd.run(client, message, args);
};
