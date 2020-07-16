exports.run = (client, message, args) => {
    if(client.voiceChannels.length === 0) {
        message.channel.send("You have not started a session yet! Please run the =newsession command.")
        return
      }
    client.sessionRunning = false;
    client.currentPlayers = [];
    client.spectator = [];
    message.channel.send(
        "Session ended! Cleared all lists."
    );
}