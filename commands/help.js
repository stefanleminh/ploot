const Discord = require("discord.js");

exports.run = (client, message, args) => {
  let helpEmbed = new Discord.MessageEmbed()
    .setTitle("Help")
    .setColor("#B1F7AA")
    .setAuthor(`${message.guild.name} Event`, message.guild.iconURL)
    .addField("`=help`", "Shows this help message")
    .addField("`=list`", "Lists active players and spectators")
    .addField(
      "`=addPlayer [name] ...`",
      "Adds one or multiple participants to the active players"
    )
    .addField(
      "`=addSpectator [name] ...`",
      "Adds one or multiple participants as a spectator"
    )
    .addField("`=remove [name] ...`", "Removes one player from the session")
    .addField(
      "`=switchMode [name]`",
      "Switches the player form active player to spectator or vise versa"
    )
    .addField("`=randomize`", "Randomizes and shows the new teams");
  message.channel.send(helpEmbed);
};
