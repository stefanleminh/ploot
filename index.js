const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const path = require('path');

const logger = require('./logging/winston')(path.basename(__filename));
client.config = require('./config.json');
client.currentPlayers = [];
client.currentSpectators = [];
client.voiceChannels = [];
client.firstTeam = [];
client.secondTeam = [];
client.spectatorTeam = [];
client.lastRoundSpectators = [];

fs.readdir('./events/', (err, files) => {
  if (err) {
    return logger.error(err);
  }
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    let eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
  if (err) {
    return logger.error(err);
  }
  files.forEach((file) => {
    if (!file.endsWith('.js')) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split('.')[0];
    client.commands.set(commandName, props);
    logger.info(`Loaded command ${commandName}`);
  });
});

client.login(client.config.token);
