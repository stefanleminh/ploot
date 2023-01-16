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
const path = require('path');
const log = require('../logging/winston')(path.basename(__filename));
const validation = require('../modules/validation');
module.exports = {
    name: 'interactionCreate',
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isCommand())
                return;
            const command = client.commands.get(interaction.commandName);
            if (!command)
                return;
            if (command.requiresActiveSession &&
                !validation.isActiveSession(client, interaction.guild.id)) {
                yield interaction.reply('You have not started a session yet! Please run the /newsession command.');
                return;
            }
            try {
                log.info(`Running command: ${command.data.name}`);
                yield command.execute(interaction, client);
            }
            catch (error) {
                log.error(error);
                yield interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
        });
    }
};
