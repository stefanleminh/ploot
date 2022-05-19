const path = require("path");
const logger = require("../logging/winston")(path.basename(__filename));
const Discord = require("discord.js");

const addParticipant = (participant, message, array, arrayname) => {
  if (array.includes(participant)) {
    logger.debug(
      "Participant " +
        participant.username +
        "already exists in " +
        arrayname +
        "!"
    );
    message.channel.send(
      "Participant <@" +
        participant.id +
        "> already exists in " +
        arrayname +
        "!"
    );
    return;
  }
  array.push(participant);
  logger.debug(
    "Added participant " + participant.username + " to list " + arrayname
  );
  message.channel.send(
    "Added participant <@" + participant.id + "> to list " + arrayname
  );
};

exports.addParticipant = addParticipant;

const chunk = (arr, chunkSize) => {
  const R = [];
  for (let i = 0, len = arr.length; i < len; i += chunkSize) {
    R.push(arr.slice(i, i + chunkSize));
  }

  return R;
};

exports.chunk = chunk;

const purge = (client, interaction) => {
  console.log(
    interaction.guild.channels.cache.get(client.config.lobby).members.keys
  );
  const membersInLobby = Array.from(
    interaction.guild.channels.cache.get(client.config.lobby).members.keys()
  );

  const remainingPlayers = client.currentPlayers.filter((currentPlayer) =>
    membersInLobby.includes(currentPlayer.id)
  );
  logger.debug(
    "Remaining Players are: " +
      remainingPlayers.map((player) => player.username).join(",")
  );

  const purgedPlayers = client.currentPlayers.filter(
    (currentPlayer) => !membersInLobby.includes(currentPlayer.id)
  );
  logger.debug(
    "Purged Players are: " +
      purgedPlayers.map((player) => player.username).join(",")
  );

  client.currentPlayers = remainingPlayers;
  purgedPlayers.forEach((removedPlayer) => {
    interaction.channel.send(
      "Purged <@" + removedPlayer.id + "> from list of current players!"
    );
  });

  const remainingSpectators = client.currentSpectators.filter(
    (currentSpectator) => membersInLobby.includes(currentSpectator.id)
  );
  logger.debug(
    "Remaining Spectators are: " +
      remainingSpectators.map((spectator) => spectator.username).join(",")
  );

  const purgedSpectators = client.currentSpectators.filter(
    (currentSpectator) => !membersInLobby.includes(currentSpectator.id)
  );
  logger.debug(
    "Purged spectators are: " +
      purgedSpectators.map((spectator) => spectator.username).join(",")
  );

  client.currentSpectators = remainingSpectators;
  purgedSpectators.forEach((removedSpectator) => {
    interaction.channel.send(
      "Purged <@" + removedSpectator.id + "> from list of current spectators!"
    );
  });
};

exports.purge = purge;

const createEmbed = (list, title, color, interaction) => {
  const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(color)
    .setAuthor({
      name: `${interaction.guild.name} 6v6-Event`,
      iconURL: interaction.guild.iconURL,
    })
    .addFields(
      chunk(list, 6).map((chunk) => {
        return { name: title, value: chunk.toString(), inline: true };
      })
    );

  return embed;
};

exports.createEmbed = createEmbed;
