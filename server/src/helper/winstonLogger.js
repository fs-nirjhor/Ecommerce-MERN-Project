const { createLogger, format, transports } = require("winston");
const {combine, colorize, simple, json, timestamp} = format;
const logger = createLogger({
  level: "info",
  format: combine(
      json(),
    timestamp({ format: "DD-MM-YYYY HH:MM:SS" }),
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        simple(),
      ),
    }),
  ],
});

module.exports = logger;
