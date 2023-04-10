/* eslint-disable */
import {createLogger, transports, format} from 'winston';
import config from '../../config.json' assert { type: "json" };
import 'winston-daily-rotate-file'

export function logging (filename: string) {
  return createLogger({
    level: config.loggingLevel,
    transports: [
      new transports.Console(),
      new transports.DailyRotateFile({ filename: './logs/ploot-%DATE%.log' })
    ],
    format: format.combine(
     format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.label({ label: filename }),
      format.printf(
        (info: any) => `[${info.timestamp}] [${info.label}] [${info.level}]: ${
          info.message
        } ${info.stack || ''}`
      )
    )
  });
}
