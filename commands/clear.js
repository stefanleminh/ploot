const path = require("path");
const logger = require("../logging/winston")(path.basename(__filename));
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears active players and spectators list."),
  aliases: ["c"],
  args: "",
  requiresActiveSession: true,
  async execute(interaction, client) {
    this.clearLists(client);
    logger.debug("Cleared all lists from participants!");
    await interaction.reply("Cleared all lists from participants!");
  },
  clearLists(client) {
    client.currentPlayers = [];
    client.currentSpectators = [];
    client.firstTeam = [];
    client.secondTeam = [];
    client.lastRoundSpectators = [];
  },
};
