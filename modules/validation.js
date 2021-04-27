const isActiveSession = (client) => {
  const isActiveSession = client.voiceChannels.length === 3;
  client.logger.debug('Current session is active: [' + isActiveSession + ']');
  return isActiveSession;
};
exports.isActiveSession = isActiveSession;
