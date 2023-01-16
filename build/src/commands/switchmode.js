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
        .setName('switchmode')
        .setDescription('Switches the player from active player to spectator or vise versa.')
        .addUserOption((option) => option
        .setName('user')
        .setDescription('The user whose status to switch')
        .setRequired(true)),
    args: '[@DiscordUser]',
    requiresActiveSession: true,
    execute(interaction, client, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const userParameter = interaction.options.getUser('user');
            const lobbyVc = yield properties.lobbies.get(interaction.guild.id);
            const guildUser = yield interaction.guild.channels.cache
                .get(lobbyVc)
                .members.get(userParameter.id);
            if (!guildUser) {
                logger.info(`User ${userParameter.username} not found as an active player or spectator`);
                yield interaction.reply(`Participant <@${userParameter.id}> not found as active player or spectator.`);
                return;
            }
            const spectatorRoleId = yield properties.spectatorRoleIds.get(interaction.guild.id);
            const isSpectator = [...guildUser.roles.cache.keys()].includes(spectatorRoleId);
            if (!isSpectator) {
                yield guildUser.roles.add(spectatorRoleId);
                logger.info(`User ${userParameter.username} is now a spectator`);
                interaction.reply(`<@${userParameter.id}> is now spectator.`);
            }
            else {
                yield guildUser.roles.remove(spectatorRoleId);
                logger.info(`User ${userParameter.username} is now an active player`);
                interaction.reply(`<@${userParameter.id}> is now an active player.`);
            }
        });
    }
};
