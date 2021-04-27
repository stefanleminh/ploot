const addParticipant = (participant, message, array, arrayname) => {
  if (array.includes(participant)) {
    message.channel.send('Participant <@' + participant.id + '> already exists in ' + arrayname + '!');
    return;
  }
  array.push(participant);

  message.channel.send('Added participant <@' + participant.id + '> to list ' + arrayname);
};

exports.addParticipant = addParticipant;

const chunk = (arr, chunkSize) => {
  var R = [];
  for (var i = 0, len = arr.length; i < len; i += chunkSize) R.push(arr.slice(i, i + chunkSize));
  return R;
};

exports.chunk = chunk;

const purge = (client, message) => {
  const membersInLobby = message.guild.channels.cache.get(client.config.lobby).members.keyArray();
  const purgedPlayers = client.currentPlayers.filter((currentPlayer) => membersInLobby.includes(currentPlayer.id));
  const removedPlayers = client.currentPlayers.filter((currentPlayer) => !membersInLobby.includes(currentPlayer.id));
  client.currentPlayers = purgedPlayers;
  removedPlayers.forEach((removedPlayer) => {
    message.channel.send('Purged <@' + removedPlayer.id + '> from list of current players!');
  });

  const purgedSpectators = client.currentSpectators.filter((currentSpectator) =>
    membersInLobby.includes(currentSpectator.id)
  );
  const removedSpectators = client.currentSpectators.filter(
    (currentSpectator) => !membersInLobby.includes(currentSpectator.id)
  );
  client.currentSpectators = purgedSpectators;
  removedSpectators.forEach((removedSpectator) => {
    message.channel.send('Purged <@' + removedSpectator.id + '> from list of current spectators!');
  });
};

exports.purge = purge;
