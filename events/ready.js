module.exports = (client) => {
  // Log that the bot is online.
  client.logger.info(
    `${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`
  );
  client.user.setActivity(' everyone 👀', { type: 'WATCHING' });
};
