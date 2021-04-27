const winston = require('winston');

const logger = (filename) => {
  return new winston.createLogger({
    level: 'debug',
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.label({ label: filename }),
      winston.format.printf((info) => `[${info.timestamp}] [${info.label}] [${info.level}]: ${info.message}`)
    ),
  });
};
module.exports = logger;
