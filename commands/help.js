const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows this help message."),
  aliases: ["h"],
  args: "",
  requiresActiveSession: false,
  async execute(interaction) {
    const sortedCommands = interaction.client.commands.sort((a, b) =>
      a.data.name.localeCompare(b.data.name)
    );
    const helpEmbed = new Discord.MessageEmbed()
      .setTitle("Help")
      .setColor("#B1F7AA")
      .setAuthor({
        name: `${interaction.guild.name} 6v6-Event`,
        iconURL: interaction.guild.iconURL,
      });

    sortedCommands.forEach((command) => {
      helpEmbed.addField(
        `/${command.data.name} ${command.args}`,
        `${command.data.description}`
      );
    });

    await interaction.reply({ embeds: [helpEmbed] });
  },
};
