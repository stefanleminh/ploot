"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const logger = require('../logging/winston')(path.basename(__filename));
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('startmatch')
        .setDescription('Moves the users to the designated team channels. '),
    args: '',
    requiresActiveSession: true,
    execute(interaction, client, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            yield interaction.deferReply();
            const lobbyVcId = yield properties.lobbies.get(interaction.guild.id);
            const firstTeamVcId = yield properties.firstTeamVcs.get(interaction.guild.id);
            const secondTeamVcId = yield properties.secondTeamVcs.get(interaction.guild.id);
            const firstTeamRoleId = yield properties.firstTeamRoleIds.get(interaction.guild.id);
            const firstTeam = interaction.guild.channels.cache
                .get(lobbyVcId)
                .members.filter((member) => member.roles.cache.some((role) => role.id === firstTeamRoleId))
                .map((guildmember) => guildmember.user);
            const secondTeamRoleId = yield properties.secondTeamRoleIds.get(interaction.guild.id);
            const secondTeam = interaction.guild.channels.cache
                .get(lobbyVcId)
                .members.filter((member) => member.roles.cache.some((role) => role.id === secondTeamRoleId))
                .map((guildmember) => guildmember.user);
            firstTeam.forEach((player) => {
                const member = interaction.guild.members.cache.get(player.id);
                promises.push(setVoiceChannel(member, firstTeamVcId, interaction));
            });
            secondTeam.forEach((player) => {
                const member = interaction.guild.members.cache.get(player.id);
                promises.push(setVoiceChannel(member, secondTeamVcId, interaction));
            });
            yield Promise.all(promises);
            yield interaction.editReply('GLHF!');
        });
    }
};
function setVoiceChannel(member, voiceChannel, interaction) {
    if (member.voice.channel) {
        if (member.voice.channel.id !== voiceChannel.id) {
            logger.info(`Moving user ${member.user.username} to voice channel ${interaction.guild.channels.cache.get(voiceChannel).name}`);
            return member.voice.setChannel(voiceChannel);
        }
        else if (member.voice.channel.id === voiceChannel.id) {
            logger.info(`User ${member.user.username} is already in the correct vc and will not be moved.`);
        }
    }
    else {
        logger.info(`User ${member.user.username} is not connected to the lobby and will not be moved.`);
        interaction.channel.send(`<@${member.user.id}> is not connected to the lobby and will not be moved.`);
    }
}
