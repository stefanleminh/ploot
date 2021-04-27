const winston = require('winston');

const logger = new winston.createLogger({
  level: 'debug',
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf((info) => `[${info.timestamp}] [${info.level}]: ${info.message}`),
    winston.format.errors({ stack: true })
  ),
});
module.exports = logger;
