"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logging = void 0;
/* eslint-disable */
const winston = require('winston');
const config = require('../../config');
function logging(filename) {
    return new winston.createLogger({
        level: config.loggingLevel,
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: '../logs/logs.log' })
        ],
        format: winston.format.combine(winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }), winston.format.label({ label: filename }), winston.format.printf((info) => `[${info.timestamp}] [${info.label}] [${info.level}]: ${info.message} ${info.stack || ''}`))
    });
}
exports.logging = logging;