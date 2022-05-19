const clear = require("./clear");
const path = require("path");
const logger = require("../logging/winston")(path.basename(__filename));
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("endsession")
    .setDescription("Ends the session and clears all the data."),
  aliases: ["es"],
  args: "",
  requiresActiveSession: true,
  async execute(interaction, client) {
    clear.clearLists(client);
    client.voiceChannels = [];
    logger.debug("Session ended! Cleared all lists.");
    await interaction.reply("I ended the session and cleared all lists.");
  },
};
