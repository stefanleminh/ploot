/* eslint-disable */
const winston = require('winston')
const config = require('../../config')

const logger = (filename: any) => {
  return new winston.createLogger({
    level: config.loggingLevel,
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: '../logs/logs.log' })
    ],
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.label({ label: filename }),
      winston.format.printf(
        (info: any) => `[${info.timestamp}] [${info.label}] [${info.level}]: ${
          info.message
        } ${info.stack || ''}`
      )
    )
  });
}
module.exports = logger
