const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('startmatch')
    .setDescription('Moves the users to the designated team channels. '),
  args: '',
  requiresActiveSession: true,
  async execute (interaction, client) {
    await interaction.deferReply()
    const spectatorTeamVc = interaction.guild.channels.cache.get(
      client.config.lobby
    )
    const spectatorTeam = interaction.guild.channels.cache
      .get(client.config.lobby)
      .members.filter(member =>
        member.roles.cache.every(
          role =>
            role.id === client.spectatorRoleId ||
            (role.id !== client.firstTeamRoleId &&
              role.id !== client.secondTeamRoleId)
        )
      )
      .map(guildmember => guildmember.user)
    const firstTeamVc = interaction.guild.channels.cache.get(
      client.config.firstTeamVc
    )
    const firstTeam = interaction.guild.channels.cache
      .get(client.config.lobby)
      .members.filter(member =>
        member.roles.cache.some(role => role.id === client.firstTeamRoleId)
      )
      .map(guildmember => guildmember.user)
    const secondTeamVc = interaction.guild.channels.cache.get(
      client.config.secondTeamVc
    )
    const secondTeam = interaction.guild.channels.cache
      .get(client.config.lobby)
      .members.filter(member =>
        member.roles.cache.some(role => role.id === client.secondTeamRoleId)
      )
      .map(guildmember => guildmember.user)

    spectatorTeam.forEach(async spectator => {
      const member = interaction.guild.members.cache.get(spectator.id)
      await setVoiceChannel(member, spectatorTeamVc, interaction, client)
    })

    firstTeam.forEach(async player => {
      const member = interaction.guild.members.cache.get(player.id)
      await setVoiceChannel(member, firstTeamVc, interaction, client)
    })

    secondTeam.forEach(async player => {
      const member = interaction.guild.members.cache.get(player.id)
      await setVoiceChannel(member, secondTeamVc, interaction, client)
    })
    await interaction.editReply('GLHF!')
  }
}
function setVoiceChannel (member, voiceChannel, message) {
  if (member.voice.channel) {
    if (member.voice.channel.id !== voiceChannel.id) {
      logger.info(
        `Moved user ${member.user.username} to voice channel ${voiceChannel.name}`
      )
      return member.voice.setChannel(voiceChannel)
    } else if (member.voice.channel.id === voiceChannel.id) {
      logger.info(
        `User ${member.user.username} is already in the correct vc and will not be moved.`
      )
    }
  } else {
    logger.info(
      `User ${member.user.username} is not connected to the lobby and will not be moved.`
    )
    message.channel.send(
      `<@${member.id}> is not connected to the lobby and will not be moved.`
    )
  }
}
