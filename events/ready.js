module.exports = (client) => {
  // Log that the bot is online.
  client.logger.log(
    `${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`,
    "Ready!"
  );
  client.user.setActivity(" everyone 👀", { type: "WATCHING" });
};
