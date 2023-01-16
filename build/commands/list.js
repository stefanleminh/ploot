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
const functions = require('../modules/functions');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Lists active players and spectators.'),
    args: '',
    requiresActiveSession: true,
    execute(interaction, client, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            const lobbyVc = yield properties.lobbies.get(interaction.guild.id);
            const spectatorRoleId = yield properties.spectatorRoleIds.get(interaction.guild.id);
            const currentPlayers = interaction.guild.channels.cache
                .get(lobbyVc)
                .members.filter((member) => {
                return member.roles.cache.every((role) => role.id !== spectatorRoleId) &&
                    !member.user.bot;
            })
                .map((guildmember) => guildmember.user);
            const currentSpectators = interaction.guild.channels.cache
                .get(lobbyVc)
                .members.filter((member) => {
                return member.roles.cache.some((role) => role.id === spectatorRoleId) &&
                    !member.user.bot;
            })
                .map((guildmember) => guildmember.user);
            const embeds = [
                functions.createEmbed(currentPlayers, 'Players', '#000088', interaction),
                functions.createEmbed(currentSpectators, 'Spectators', '#fe0000', interaction)
            ];
            yield interaction.editReply({
                embeds: embeds
            });
        });
    }
};
