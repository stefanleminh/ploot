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
const validation = require('../modules/validation');
const path = require('path');
const logger = require('../logging/winston')(path.basename(__filename));
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('newsession')
        .setDescription('Creates a session and roles with the pre-configured channels.'),
    args: '',
    requiresActiveSession: false,
    execute(interaction, client, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            const isActiveSession = yield validation.isActiveSession(properties, interaction.guild.id);
            // TODO: Either run configure or give an error message if not configured
            if (isActiveSession) {
                interaction.editReply("There's already a session running! Please run /endsession first before starting a new session.");
                return;
            }
            const isConfigured = yield validation.isConfigured(properties, interaction.guild.id);
            if (!isConfigured) {
                interaction.editReply('I am not configured for this server yet! Please run /configure first before starting a new session.');
                return;
            }
            const lobbyVcId = yield properties.lobbies.get(interaction.guild.id);
            const firstTeamVcId = yield properties.firstTeamVcs.get(interaction.guild.id);
            const secondTeamVcId = yield properties.secondTeamVcs.get(interaction.guild.id);
            const spectatorRole = yield interaction.guild.roles.create({
                name: 'Spectators',
                color: '#ffa500',
                reason: 'Spectator role for event'
            });
            logger.info('Setting spectator role id to: ' + spectatorRole.id);
            yield properties.spectatorRoleIds.set(interaction.guild.id, spectatorRole.id);
            const firstTeamRole = yield interaction.guild.roles.create({
                name: interaction.guild.channels.cache.get(firstTeamVcId).name,
                color: '#000088',
                reason: 'Team role for event'
            });
            logger.info('Setting first team role id to: ' + firstTeamRole.id);
            yield properties.firstTeamRoleIds.set(interaction.guild.id, firstTeamRole.id);
            const secondTeamRole = yield interaction.guild.roles.create({
                name: interaction.guild.channels.cache.get(secondTeamVcId).name,
                color: '#fe0000',
                reason: 'Team role for event'
            });
            logger.info('Setting second team role id to: ' + secondTeamRole.id);
            yield properties.secondTeamRoleIds.set(interaction.guild.id, secondTeamRole.id);
            if (!validation.isActiveSession(properties)) {
                yield interaction.reply('Unable to add channels to start a session! Please try again or check the help command.');
                return;
            }
            yield properties.lastRoundSpectatorIds.set(interaction.guild.id, []);
            yield interaction.editReply(`New session has been created! <#${lobbyVcId}> is the general/spectator's lobby. <#${firstTeamVcId}> is the first team's lobby. <#${secondTeamVcId}> is the second team's lobby. <@&${spectatorRole.id}> is the role for dedicated spectators. <@&${firstTeamRole.id}> is the first teams role. <@&${secondTeamRole.id}> is the second teams role. `);
        });
    }
};
