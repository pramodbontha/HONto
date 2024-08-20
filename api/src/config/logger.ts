import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize, errors } = format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    colorize(),
    timestamp(),
    errors({ stack: true }),
    customFormat
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), customFormat),
    }),
  ],
  exceptionHandlers: [
    new transports.Console({
      format: combine(colorize(), customFormat),
    }),
  ],
});

export default logger;
