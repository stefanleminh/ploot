const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))

module.exports = {
  name: 'startmatch',
  aliases: ['sm'],
  description: 'Moves the users to the designated team channels. The user has to be in a VC to work. Will send a message and not move a user if they are not in the lobby.',
  args: '',
  requiresActiveSession: true,
  execute (message, args, client) {
    client.currentSpectators.forEach((spectator) => {
      const member = message.guild.members.cache.get(spectator.id)
      setTimeout(function () {
        setVoiceChannel(member, client.voiceChannels[0], message, client)
      }, 850)
    })

    client.firstTeam.forEach((player) => {
      const member = message.guild.members.cache.get(player.id)
      setTimeout(function () {
        setVoiceChannel(member, client.voiceChannels[1], message, client)
      }, 850)
    })

    client.secondTeam.forEach((player) => {
      const member = message.guild.members.cache.get(player.id)
      setTimeout(function () {
        setVoiceChannel(member, client.voiceChannels[2], message, client)
      }, 850)
    })
  }
}
function setVoiceChannel (member, voiceChannel, message) {
  if (member.voice.channel) {
    member.voice.setChannel(voiceChannel)
    logger.info(`Moved user ${member.user.username} to voice channel ${voiceChannel.name}`)
  } else {
    logger.info(`User ${member.user.username} is not connected to the lobby and will not be moved.`)
    message.channel.send(`<@${member.id}> is not connected to the lobby and will not be moved.`)
  }
}
