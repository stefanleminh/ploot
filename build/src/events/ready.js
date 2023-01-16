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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const logger = require('../logging/winston')(path_1.default.basename(__filename));
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const config = require('../../config.json');
const TOKEN = config.token;
const TEST_GUILD_ID = config.testGuildId;
const fs = require('fs');
module.exports = {
    name: 'ready',
    once: true,
    execute(client, properties) {
        const commands = [];
        // Take commands
        const commandFiles = fs
            .readdirSync('./src/commands')
            .filter((file) => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require('../commands/' + file);
            commands.push(command.data.toJSON());
            properties.commands.set(command.data.name, command);
            logger.info(`Loaded command ${command.data.name}`);
        }
        // Registering the commands in the client
        const CLIENT_ID = client.user.id;
        const rest = new rest_1.REST({
            version: '9'
        }).setToken(TOKEN);
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!TEST_GUILD_ID) {
                    yield rest.put(v9_1.Routes.applicationCommands(CLIENT_ID), {
                        body: commands
                    });
                    logger.info('Successfully registered application commands globally');
                }
                else {
                    yield rest.put(v9_1.Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID), {
                        body: commands
                    });
                    logger.info('Successfully registered application commands for development guild');
                }
            }
            catch (error) {
                if (error)
                    logger.error(error);
            }
        }))();
        // Log that the bot is online.
        logger.info(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`);
        client.user.setActivity(' everyone 👀', { type: 'WATCHING' });
    }
};
