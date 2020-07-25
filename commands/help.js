const Discord = require("discord.js");

exports.run = (client, message, args) => {
  let helpEmbed = new Discord.MessageEmbed()
    .setTitle("Help")
    .setColor("#B1F7AA")
    .setAuthor(`${message.guild.name} 6v6-Event`, message.guild.iconURL)
    .addField("`=help`", "Shows this help message.")
    .addField(
      "`=newsession [lobby-channelname] [firstteam-channelname] [secondteam-channelname]`",
      "Creates a session and lets the bot know what channels to move the users to. The bot will look for channels, that include the provided name (thus the provided name doesn't have to be exact)."
    )
    .addField("`=endsession`", "Ends the session and clears all the data.")
    .addField(
      "`=startmatch`",
      "Moves the users to the designated team channels. The user has to be in a VC to work."
    )
    .addField("`=list`", "Lists active players and spectators.")
    .addField(
      "`=addplayer [@DiscordUser] ...`",
      "Adds one or multiple participants to the active players."
    )
    .addField(
      "`=addspectator [@DiscordUser] ...`",
      "Adds one or multiple participants as a spectator."
    )
    .addField(
      "`=remove [@DiscordUser] ...`",
      "Removes one or multiple participants from the session."
    )
    .addField(
      "`=switchmode [@DiscordUser]`",
      "Switches the player form active player to spectator or vise versa."
    )
    .addField("`=randomize`", "Randomizes and shows the new teams.")
    .addField("`=clear`", "Clears active players and spectators list.");
  message.channel.send(helpEmbed);
};
