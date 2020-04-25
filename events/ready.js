module.exports = (client) => {
  // Log that the bot is online.
  client.logger.log(
    `${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`,
    "ready"
  );
  client.user.setActivity(" Mr. Doofenshmirtz 👀", { type: "WATCHING" });
};
