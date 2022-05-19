const functions = require("../modules/functions");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Lists active players and spectators."),
  aliases: ["l"],
  args: "",
  requiresActiveSession: true,
  async execute(interaction, client) {
    const embeds = [];
    embeds.push(
      functions.createEmbed(
        client.currentPlayers,
        "Players",
        "#000088",
        interaction
      ),
      functions.createEmbed(
        client.currentSpectators,
        "Spectators",
        "#fe0000",
        interaction
      )
    );

    await interaction.reply({
      embeds: embeds,
    });
  },
};
