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

    const lobbyVcId = await client.lobbies.get(interaction.guild.id)
    const firstTeamVcId = await client.firstTeamVcs.get(interaction.guild.id)
    const secondTeamVcId = await client.secondTeamVcs.get(interaction.guild.id)

    const firstTeamRoleId = await client.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const firstTeam = interaction.guild.channels.cache
      .get(lobbyVcId)
      .members.filter(member =>
        member.roles.cache.some(role => role.id === firstTeamRoleId)
      )
      .map(guildmember => guildmember.user)

    const secondTeamRoleId = await client.secondTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeam = interaction.guild.channels.cache
      .get(lobbyVcId)
      .members.filter(member =>
        member.roles.cache.some(role => role.id === secondTeamRoleId)
      )
      .map(guildmember => guildmember.user)

    firstTeam.forEach(player => {
      const member = interaction.guild.members.cache.get(player.id)
      promises.push(setVoiceChannel(member, firstTeamVcId, interaction))
    })

    secondTeam.forEach(player => {
      const member = interaction.guild.members.cache.get(player.id)
      promises.push(setVoiceChannel(member, secondTeamVcId, interaction))
    })
    await Promise.all(promises)
    await interaction.editReply('GLHF!')
  }
}
function setVoiceChannel (member, voiceChannel, interaction) {
  console.log(member)
  if (member.voice.channel) {
    if (member.voice.channel.id !== voiceChannel.id) {
      logger.info(
        `Moving user ${member.user.username} to voice channel ${
          interaction.guild.channels.cache.get(voiceChannel).name
        }`
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
    interaction.channel.send(
      `<@${member.user.id}> is not connected to the lobby and will not be moved.`
    )
  }
}
