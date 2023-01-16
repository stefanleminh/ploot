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
        .setName('clear')
        .setDescription('Remove any roles from every participant and clears last round spectators.'),
    args: '',
    requiresActiveSession: true,
    execute(interaction, client, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.guild === null || interaction.guild === undefined) {
                throw new Error("Interaction is not part of a guild!");
            }
            yield interaction.deferReply();
            const promises = [];
            const spectatorRoleId = yield properties.spectatorRoleIds.get(interaction.guild.id);
            const firstTeamRoleId = yield properties.firstTeamRoleIds.get(interaction.guild.id);
            const secondTeamRoleId = yield properties.secondTeamRoleIds.get(interaction.guild.id);
            if (spectatorRoleId) {
                interaction.guild.roles.cache
                    .get(spectatorRoleId)
                    .members.forEach(member => {
                    promises.push(member.roles.remove(interaction.guild.roles.cache.get(spectatorRoleId)));
                });
            }
            promises.concat(functions.clearTeamRoles(interaction, firstTeamRoleId, secondTeamRoleId));
            yield properties.lastRoundSpectatorIds.set(interaction.guild.id, []);
            yield Promise.all(promises);
            logger.debug('Cleared data and roles from participants!');
            yield interaction.editReply('I cleared all data and roles from participants!');
        });
    }
};
