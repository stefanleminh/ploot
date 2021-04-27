const addParticipant = (participant, message, array, arrayname, client) => {
  if (array.includes(participant)) {
    client.logger.debug('Participant ' + participant.username + 'already exists in ' + arrayname + '!');
    message.channel.send('Participant <@' + participant.id + '> already exists in ' + arrayname + '!');
    return;
  }
  array.push(participant);
  client.logger.debug('Added participant ' + participant.username + ' to list ' + arrayname);
  message.channel.send('Added participant <@' + participant.id + '> to list ' + arrayname);
};

exports.addParticipant = addParticipant;

const chunk = (arr, chunkSize) => {
  var R = [];
  for (var i = 0, len = arr.length; i < len; i += chunkSize) {
    R.push(arr.slice(i, i + chunkSize));
  }

  return R;
};

exports.chunk = chunk;

const purge = (client, message) => {
  const membersInLobby = message.guild.channels.cache.get(client.config.lobby).members.keyArray();

  const remainingPlayers = client.currentPlayers.filter((currentPlayer) => membersInLobby.includes(currentPlayer.id));
  client.logger.debug('Remaining Players are: ' + remainingPlayers.map((player) => player.username).join(','));

  const purgedPlayers = client.currentPlayers.filter((currentPlayer) => !membersInLobby.includes(currentPlayer.id));
  client.logger.debug('Purged Players are: ' + purgedPlayers.map((player) => player.username).join(','));

  client.currentPlayers = remainingPlayers;
  purgedPlayers.forEach((removedPlayer) => {
    message.channel.send('Purged <@' + removedPlayer.id + '> from list of current players!');
  });

  const remainingSpectators = client.currentSpectators.filter((currentSpectator) =>
    membersInLobby.includes(currentSpectator.id)
  );
  client.logger.debug(
    'Remaining Spectators are: ' + remainingSpectators.map((spectator) => spectator.username).join(',')
  );

  const purgedSpectators = client.currentSpectators.filter(
    (currentSpectator) => !membersInLobby.includes(currentSpectator.id)
  );
  client.logger.debug('Purged spectators are: ' + purgedSpectators.map((spectator) => spectator.username).join(','));

  client.currentSpectators = remainingSpectators;
  purgedSpectators.forEach((removedSpectator) => {
    message.channel.send('Purged <@' + removedSpectator.id + '> from list of current spectators!');
  });
};

exports.purge = purge;
