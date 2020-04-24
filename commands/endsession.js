exports.run = (client, message, args) => {
    client.sessionRunning = false;
    client.currentPlayers = [];
    client.spectator = [];
    message.channel.send(
        "Session ended! Cleared all lists."
    );
}