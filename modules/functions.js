const addParticipant = (participant, message, array, arrayname) => {
  if (array.includes(participant)) {
    message.channel.send(
      "Participant " + participant + " already exists in " + arrayname + "!"
    );
    return;
  }
  array.push(participant);
  message.channel.send(
    "Added participant " + participant + " to list " + arrayname
  );
};

exports.addParticipant = addParticipant;
