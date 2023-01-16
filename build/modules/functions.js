"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const logger = require('../logging/winston')(path.basename(__filename));
const Discord = require('discord.js');
const addParticipant = (participant, interaction, array, arrayname) => {
    if (array.includes(participant)) {
        logger.debug(`Participant ${participant.username}already exists in ${arrayname}!`);
        interaction.channel.send(`Participant <@${participant.id}> already exists in ${arrayname}!`);
        return;
    }
    array.push(participant);
    logger.debug(`Added participant ${participant.username} to list ${arrayname}`);
    interaction.channel.send(`Added participant <@${participant.id}> to list ${arrayname}`);
};
exports.addParticipant = addParticipant;
const chunk = (arr, chunkSize) => {
    const R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
        R.push(arr.slice(i, i + chunkSize));
    }
    return R;
};
exports.chunk = chunk;
const purge = (properties, interaction) => {
    const membersInLobby = Array.from(interaction.guild.channels.cache.get(properties.config.lobby).members.keys());
    const remainingPlayers = properties.currentPlayers.filter((currentPlayer) => membersInLobby.includes(currentPlayer.id));
    logger.debug('Remaining Players are: ' +
        remainingPlayers.map((player) => player.username).join(','));
    const purgedPlayers = properties.currentPlayers.filter((currentPlayer) => !membersInLobby.includes(currentPlayer.id));
    logger.debug('Purged Players are: ' +
        purgedPlayers.map((player) => player.username).join(','));
    properties.currentPlayers = remainingPlayers;
    purgedPlayers.forEach((removedPlayer) => {
        interaction.channel.send(`Purged <@${removedPlayer.id}> from list of current players!`);
    });
    const remainingSpectators = properties.currentSpectators.filter((currentSpectator) => membersInLobby.includes(currentSpectator.id));
    logger.debug('Remaining Spectators are: ' +
        remainingSpectators.map((spectator) => spectator.username).join(','));
    const purgedSpectators = properties.currentSpectators.filter((currentSpectator) => !membersInLobby.includes(currentSpectator.id));
    logger.debug('Purged spectators are: ' +
        purgedSpectators.map((spectator) => spectator.username).join(','));
    properties.currentSpectators = remainingSpectators;
    purgedSpectators.forEach((removedSpectator) => {
        interaction.channel.send(`Purged <@${removedSpectator.id}> from list of current spectators!`);
    });
};
exports.purge = purge;
const createEmbed = (list, title, color, interaction) => {
    const embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor(color)
        .setAuthor({
        name: `${interaction.guild.name} 6v6-Event`,
        iconURL: interaction.guild.iconURL
    })
        .addFields(chunk(list, 6).map(chunk => {
        return {
            name: title,
            value: chunk.toString().replace(/,/g, '\n'),
            inline: true
        };
    }));
    return embed;
};
exports.createEmbed = createEmbed;
const clearTeamRoles = (interaction, firstTeamRoleId, secondTeamRoleId) => {
    const promises = [];
    if (firstTeamRoleId) {
        interaction.guild.roles.cache
            .get(firstTeamRoleId)
            .members.forEach((member) => {
            promises.push(member.roles.remove(interaction.guild.roles.cache.get(firstTeamRoleId)));
        });
    }
    if (secondTeamRoleId) {
        interaction.guild.roles.cache
            .get(secondTeamRoleId)
            .members.forEach((member) => {
            promises.push(member.roles.remove(interaction.guild.roles.cache.get(secondTeamRoleId)));
        });
    }
    return promises;
};
exports.clearTeamRoles = clearTeamRoles;
