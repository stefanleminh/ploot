const functions = require("../modules/functions");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("parselobby")
    .setDescription(
      "Adds every user in the lobby to the list of active players"
    ),
  aliases: ["pl"],
  args: "",
  requiresActiveSession: true,
  async execute(interaction, client) {
    interaction.guild.channels.cache
      .get(client.config.lobby)
      .members.forEach((member) => {
        if (!client.currentSpectators.includes(member.user)) {
          functions.addParticipant(
            member.user,
            interaction,
            client.currentPlayers,
            "players"
          );
        }
      });
    await interaction.reply("I have finished parsing the lobby!");
  },
};
