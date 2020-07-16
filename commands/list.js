const functions = require("../modules/functions");
const Discord = require("discord.js");

exports.run = (client, message, args) => {
  if(client.voiceChannels.length === 0) {
    message.channel.send("You have not started a session yet! Please run the =newsession command.")
    return
  }
  printList(client.currentPlayers, "Players", "#000088", message);
  printList(client.currentSpectators, "Spectators", "#fe0000", message);
};

function printList(list, title, color, message) {
  let embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(color)
    .setAuthor(`${message.guild.name} 6v6-Event`, message.guild.iconURL)
    .addFields(
      functions.chunk(list, 6).map((chunk) => {
        return { name: title, value: chunk, inline: true };
      })
    );

  message.channel.send(embed);
}
