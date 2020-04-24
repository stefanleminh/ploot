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

const chunk = (arr, chunkSize) => {
    var R = [];
    for (var i=0,len=arr.length; i<len; i+=chunkSize)
      R.push(arr.slice(i,i+chunkSize));
    return R;
}

exports.chunk = chunk;
