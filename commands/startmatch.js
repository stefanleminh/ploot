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
    const promises = []
    await interaction.deferReply()

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

    firstTeam.forEach(player => {
      const member = interaction.guild.members.cache.get(player.id)
      promises.push(setVoiceChannel(member, firstTeamVc, interaction, client))
    })

    secondTeam.forEach(player => {
      const member = interaction.guild.members.cache.get(player.id)
      promises.push(setVoiceChannel(member, secondTeamVc, interaction, client))
    })
    await Promise.all(promises)
    await interaction.editReply('GLHF!')
  }
}
function setVoiceChannel (member, voiceChannel, message) {
  if (member.voice.channel) {
    if (member.voice.channel.id !== voiceChannel.id) {
      logger.info(
        `Moving user ${member.user.username} to voice channel ${voiceChannel.name}`
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
