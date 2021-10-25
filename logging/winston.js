const winston = require('winston')
const config = require('../config')

const logger = (filename) => {
  return new winston.createLogger({ // eslint-disable-line
    level: config.loggingLevel,
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.label({ label: filename }),
      winston.format.printf((info) => `[${info.timestamp}] [${info.label}] [${info.level}]: ${info.message} ${info.stack || ''}`)
    )
  })
}
module.exports = logger
