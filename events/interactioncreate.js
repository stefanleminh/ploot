const path = require("path");
const logger = require("../logging/winston")(path.basename(__filename));
const Discord = require("discord.js");
const validation = require("../modules/validation");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;
    if (command.requiresActiveSession && !validation.isActiveSession(client)) {
      await interaction.reply(
        "You have not started a session yet! Please run the /newsession command."
      );
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
