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
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows this help message.'),
    args: '',
    requiresActiveSession: false,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortedCommands = interaction.client.commands.sort((a, b) => a.data.name.localeCompare(b.data.name));
            const helpEmbed = new Discord.MessageEmbed()
                .setTitle('Help')
                .setColor('#B1F7AA')
                .setAuthor({
                name: `${interaction.guild.name} 6v6-Event`,
                iconURL: interaction.guild.iconURL
            });
            sortedCommands.forEach((command) => {
                helpEmbed.addField(`/${command.data.name} ${command.args}`, `${command.data.description}`);
            });
            yield interaction.reply({ embeds: [helpEmbed] });
        });
    }
};
