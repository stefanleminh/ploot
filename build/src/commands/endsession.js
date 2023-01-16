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
        .setName('endsession')
        .setDescription('Ends the session and clears all the data.'),
    args: '',
    requiresActiveSession: true,
    execute(interaction, client, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            const spectatorRoleId = yield properties.spectatorRoleIds.get(interaction.guild.id);
            const firstTeamRoleId = yield properties.firstTeamRoleIds.get(interaction.guild.id);
            const secondTeamRoleId = yield properties.secondTeamRoleIds.get(interaction.guild.id);
            promises.push(interaction.guild.roles.delete(spectatorRoleId), interaction.guild.roles.delete(firstTeamRoleId), interaction.guild.roles.delete(secondTeamRoleId), properties.spectatorRoleIds.delete(interaction.guild.id), properties.firstTeamRoleIds.delete(interaction.guild.id), properties.secondTeamRoleIds.delete(interaction.guild.id), properties.lastRoundSpectatorIds.delete(interaction.guild.id));
            yield Promise.all(promises);
            logger.debug('Session ended! Cleared all data.');
            yield interaction.reply('I ended the session and cleared all data.');
        });
    }
};
