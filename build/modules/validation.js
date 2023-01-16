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
const isActiveSession = (properties, guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const isActiveSession = (yield properties.spectatorRoleIds.get(guildId)) !== undefined &&
        (yield properties.firstTeamRoleIds.get(guildId)) !== undefined &&
        (yield properties.secondTeamRoleIds.get(guildId)) !== undefined;
    logger.debug(`Current session for Guild ${guildId} is active: [${isActiveSession}]`);
    return isActiveSession;
});
exports.isActiveSession = isActiveSession;
const isConfigured = (properties, guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const isConfigured = (yield properties.lobbies.get(guildId)) !== undefined &&
        (yield properties.firstTeamVcs.get(guildId)) !== undefined &&
        (yield properties.secondTeamVcs.get(guildId)) !== undefined;
    logger.debug(`Current session for Guild ${guildId} is configured: [${isConfigured}]`);
    return isConfigured;
});
exports.isConfigured = isConfigured;
