const path = require("path");
const logger = require("../logging/winston")(path.basename(__filename));
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("startmatch")
    .setDescription("Moves the users to the designated team channels. "),
  args: "",
  requiresActiveSession: true,
  async execute(interaction, client) {
    client.currentSpectators.forEach((spectator) => {
      const member = interaction.guild.members.cache.get(spectator.id);
      setVoiceChannel(member, client.voiceChannels[0], interaction, client);
    });

    client.firstTeam.forEach((player) => {
      const member = interaction.guild.members.cache.get(player.id);
      setVoiceChannel(member, client.voiceChannels[1], interaction, client);
    });

    client.secondTeam.forEach((player) => {
      const member = interaction.guild.members.cache.get(player.id);
      setVoiceChannel(member, client.voiceChannels[2], interaction, client);
    });
    await interaction.reply("I've moved everyone! GLHF!");
  },
};
function setVoiceChannel(member, voiceChannel, message) {
  if (member.voice.channel) {
    if (member.voice.channel.id !== voiceChannel.id) {
      member.voice.setChannel(voiceChannel);
      logger.info(
        `Moved user ${member.user.username} to voice channel ${voiceChannel.name}`
      );
    } else if (member.voice.channel.id === voiceChannel.id) {
      logger.info(
        `User ${member.user.username} is already in the correct vc and will not be moved.`
      );
    }
  } else {
    logger.info(
      `User ${member.user.username} is not connected to the lobby and will not be moved.`
    );
    message.channel.send(
      `<@${member.id}> is not connected to the lobby and will not be moved.`
    );
  }
}
