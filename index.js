const { Client, Intents, Collection } = require("discord.js");
const config = require("./config.json");
const fs = require("fs");

const path = require("path");
const logger = require("./logging/winston")(path.basename(__filename));
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});

client.config = require("./config.json");
client.currentPlayers = [];
client.currentSpectators = [];
client.voiceChannels = [];
client.firstTeam = [];
client.secondTeam = [];
client.spectatorTeam = [];
client.lastRoundSpectators = [];

client.commands = new Collection();

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  logger.info(`Loaded event ${event.name}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(config.token);
