const isActiveSession = (client) => {
  return client.voiceChannels.length === 3;
};
exports.isActiveSession = isActiveSession;
