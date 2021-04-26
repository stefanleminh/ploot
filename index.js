const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

client.logger = console;
client.config = require("./config.json");
client.currentPlayers = [];
client.currentSpectators = [];
client.voiceChannels = [];
client.firstTeam = [];
client.secondTeam = [];
client.spectatorTeam = [];
client.lastRoundSpectators = [];

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Discord.Collection()

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
});

client.login(client.config.token);
