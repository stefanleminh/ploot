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
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const path = require('path');
const logger = require('../logging/winston')(path.basename(__filename));
module.exports = {
    data: new SlashCommandBuilder()
        .setName('configure')
        .setDescription('Configures the server'),
    args: '',
    requiresActiveSession: true,
    execute(interaction, client, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            const voiceChannels = interaction.guild.channels.cache
                .filter(channel => channel.type === 'GUILD_VOICE')
                .map(channel => ({
                label: channel.name,
                value: channel.id
            }));
            const spectatorVc = new MessageSelectMenu()
                .setCustomId('spectatorVc')
                .setPlaceholder('Please specify the lobby VC')
                .addOptions(voiceChannels);
            const firstTeamVc = new MessageSelectMenu()
                .setCustomId('firstTeamVc')
                .setPlaceholder('Please specify the first team VC')
                .addOptions(voiceChannels);
            const secondTeamVc = new MessageSelectMenu()
                .setCustomId('secondTeamVc')
                .setPlaceholder('Please specify the second team VC')
                .addOptions(voiceChannels);
            const button = new MessageButton()
                .setCustomId('submit')
                .setLabel('Submit')
                .setStyle('PRIMARY');
            const spectatorSelect = new MessageActionRow().addComponents(spectatorVc);
            const firstTeamSelect = new MessageActionRow().addComponents(firstTeamVc);
            const secondTeamSelect = new MessageActionRow().addComponents(secondTeamVc);
            const submitRow = new MessageActionRow().addComponents(button);
            const filter = i => {
                return i.user.id === interaction.user.id;
            };
            const selectCollector = interaction.channel.createMessageComponentCollector({
                filter,
                componentType: 'SELECT_MENU'
            });
            selectCollector.on('collect', (selectInteraction) => __awaiter(this, void 0, void 0, function* () {
                if (selectInteraction.guild === null || selectInteraction.guild === undefined) {
                    throw new Error("Interaction is not part of a guild!");
                }
                let property;
                if (selectInteraction.customId === 'spectatorVc') {
                    property = properties.lobbies;
                }
                else if (selectInteraction.customId === 'firstTeamVc') {
                    property = properties.firstTeamVcs;
                }
                else if (selectInteraction.customId === 'secondTeamVc') {
                    property = properties.secondTeamVcs;
                }
                yield property.set(selectInteraction.guild.id, selectInteraction.values[0]);
                const channelName = yield interaction.guild.channels.cache.get(selectInteraction.values[0]).name;
                logger.info(`Set ${selectInteraction.customId} to ${channelName}.`);
                selectInteraction.reply({
                    content: `Set ${selectInteraction.customId} to <#${selectInteraction.values[0]}>.`,
                    ephemeral: true
                });
            }));
            const buttonCollector = interaction.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON' });
            buttonCollector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                yield interaction.editReply({
                    content: 'I am ready to go!',
                    components: []
                });
            }));
            yield interaction.editReply({
                content: 'Please configure me!',
                components: [
                    spectatorSelect,
                    firstTeamSelect,
                    secondTeamSelect,
                    submitRow
                ]
            });
        });
    }
};
