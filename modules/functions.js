const addParticipant = (participant, message, array, arrayname) => {
  array.push(participant);
  message.channel.send(
    "Added participant " + participant + " to list " + arrayname
  );
};

exports.addParticipant = addParticipant;