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
const functions = require('../modules/functions');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('endmatch')
        .setDescription('Moves the users from the team channels back to the lobby.'),
    args: '',
    requiresActiveSession: true,
    execute(interaction, client, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            const lobbyVc = yield properties.lobbies.get(interaction.guild.id);
            const firstTeamVc = yield properties.firstTeamVcs.get(interaction.guild.id);
            const secondTeamVc = yield properties.secondTeamVcs.get(interaction.guild.id);
            const promises = [];
            const firstTeamRoleId = yield properties.firstTeamRoleIds.get(interaction.guild.id);
            const secondTeamRoleId = yield properties.secondTeamRoleIds.get(interaction.guild.id);
            if (interaction.guild.channels.cache.get(firstTeamVc).members.size > 0) {
                interaction.guild.channels.cache
                    .get(firstTeamVc)
                    .members.forEach((player) => {
                    promises.push(player.voice.setChannel(lobbyVc));
                    logger.info(`Moving user ${player.user.username} to voice channel ${lobbyVc.name}`);
                });
            }
            if (interaction.guild.channels.cache.get(secondTeamVc).members.size > 0) {
                interaction.guild.channels.cache
                    .get(secondTeamVc)
                    .members.forEach((player) => {
                    promises.push(player.voice.setChannel(lobbyVc));
                    logger.info(`Moving user ${player.user.username} to voice channel ${lobbyVc.name}`);
                });
            }
            functions.clearTeamRoles(interaction, firstTeamRoleId, secondTeamRoleId);
            yield Promise.all(promises);
            yield interaction.editReply('GG!');
        });
    }
};
