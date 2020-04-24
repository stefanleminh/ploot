const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

let currentPlayers = [];
let currentSpectators = [];
let sessionRunning = false;

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift();
  // TODO: Validation
  if (command === "newSession") {
    message.channel.send(
      "New session has been created! You can now add users."
    );
    // Create Session-
    sessionRunning = true;
  }
  if (command === "endSession") {
    message.channel.send("Session ended!");
    // End Session
    currentPlayers.clear();
    sessionRunning = false;
  }
  if (command === "addPlayer") {
    if (args.length === 0) {
      message.channel.send("Please provide a name to add.");
      return;
    }
    args.forEach((player) => {
      addParticipant(player, message, currentPlayers, "players");
    });
  }
  if (command === "addSpectator") {
    // Add Player to List
    if (args.length === 0) {
      message.channel.send("Please provide a name to add.");
      return;
    }
    args.forEach((spectator) => {
      addParticipant(spectator, message, currentSpectators, "spectators");
    });
  }
  if (command === "clear") {
    currentPlayers.forEach((player) => removeParticipant(player, message));
    currentSpectators.forEach((spectator) =>
      removeParticipant(spectator, message)
    );
    message.channel.send("Cleared all lists from participants!");
  }
  if (command === "remove") {
    if (args.length === 0) {
      message.channel.send("Please provide a name to add.");
      return;
    }
    let participant = args[0];
    let returnObject = removeParticipant(participant, message);
    message.channel.send(
      "Removed participant " +
        returnObject.participant +
        " from list of " +
        returnObject.list +
        "."
    );
  }
  if (command === "switchMode") {
    // Switch mode of Player
    if (args.length === 0) {
      message.channel.send("Please provide a name to add.");
      return;
    }
    let participant = args[0];

    if (currentPlayers.includes(participant)) {
      currentSpectators.push(participant);
      currentPlayers = currentPlayers.filter(
        (element) => element != participant
      );
      message.channel.send(participant + " is now spectator.");
    } else if (currentSpectators.includes(participant)) {
      currentPlayers.push(participant);
      currentSpectators = currentSpectators.filter(
        (element) => element != participant
      );
      message.channel.send(participant + " is now an active player.");
    } else {
      message.channel.send(
        "Participant `" +
          participant +
          "` not found as active player or spectator."
      );
    }
  }
  if (command === "randomize") {
    let randomizedPlayers = shuffle(currentPlayers);
    const randomizedPlayerPool = randomizedPlayers.slice(0, 12);
    let teams = createTeams(randomizedPlayerPool);
    let firstTeam = teams[0];
    let secondTeam = teams[1];
    let spectators = currentSpectators.concat(randomizedPlayers.slice(12));
    printTeam("Team 1", firstTeam, "#000088", message);
    printTeam("Team 2", secondTeam, "#fe0000", message);
    printTeam("Spectators", spectators, "#ffa500", message);
  }
  if (command === "list") {
    message.channel.send("Active players: " + currentPlayers);
    message.channel.send("Spectators: " + currentSpectators);
  }
  // Debug Commands
  if (command === "adp") {
    currentPlayers.push("Player1");
    currentPlayers.push("Player2");
    currentPlayers.push("Player3");
    currentPlayers.push("Player4");
    currentPlayers.push("Player5");
    currentPlayers.push("Player6");
    currentPlayers.push("Player7");
    currentPlayers.push("Player8");
    currentPlayers.push("Player9");
    currentPlayers.push("Player10");
    currentPlayers.push("Player11");
    currentPlayers.push("Player12");
    message.channel.send("Added players to list of current players!");
  }

  if (command === "help") {
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
      .addField("`=randomize`", "Randomizes and shows the new teams")
      .addFields(
        { name: "Regular field title", value: "Some value here" },
        { name: "\u200B", value: "\u200B" },
        { name: "Inline field title", value: "Some value here", inline: true },
        { name: "Inline field title", value: "Some value here", inline: true }
      );
    message.channel.send(helpEmbed);
  }
});

function printTeam(title, team, color, message) {
  if (team.length === 0) {
    return;
  }
  let teamEmbed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(color)
    .setAuthor(`${message.guild.name} Event`, message.guild.iconURL)
    .addField("Team", team);

  message.channel.send(teamEmbed);
}

function removeParticipant(participant, message) {
  if (currentPlayers.includes(participant)) {
    currentPlayers = currentPlayers.filter((player) => player != participant);
    return {
      participant: participant,
      list: "players",
    };
  } else if (currentSpectators.includes(participant)) {
    currentSpectators = currentSpectators.filter(
      (spectator) => spectator != participant
    );
    return {
      participant: participant,
      list: "spectators",
    };
  } else {
    message.channel.send(
      "Participant " + participant + " not found as active player or spectator"
    );
    return;
  }
}

function addParticipant(participant, message, array, arrayname) {
  array.push(participant);
  message.channel.send(
    "Added participant " + participant + " to list " + arrayname
  );
}

function createTeams(players) {
  let results = [];

  const firstTeam = players.slice(0, players.length / 2);
  const secondTeam = players.slice(players.length / 2, players.length);
  results.push(firstTeam);
  results.push(secondTeam);

  return results;
}

/**
 * Shuffles array in place.
 * @param {Array} array items An array containing the items.
 */
function shuffle(array) {
  let j,
    x,
    i,
    result = array.slice();
  for (i = result.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = result[i];
    result[i] = result[j];
    result[j] = x;
  }
  return result;
}

client.login(config.token);
