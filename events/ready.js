const path = require('path');
const logger = require('../logging/winston')(path.basename(__filename));

module.exports = (client) => {
  // Log that the bot is online.
  logger.info(
    `${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`
  );
  client.user.setActivity(' everyone 👀', { type: 'WATCHING' });
};
