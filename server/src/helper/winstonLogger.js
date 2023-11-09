const { createLogger, format, transports} = require("winston");
const { combine, colorize, simple, timestamp, prettyPrint } = format;
 
const infoTransport = new transports.File({
  filename: "src/logs/combined.log",
  level: "info",
  format: combine(
    timestamp({ format: "DD-MM-YYYY hh:mm:ss" }),
    prettyPrint()
  ),
});
const errorTransport = new transports.File({
  filename: "src/logs/error.log",
  level: "error",
  format: combine(
    timestamp({ format: "DD-MM-YYYY hh:mm:ss" }),
    prettyPrint()
  ),
});
const consoleTransport = new transports.Console({
  format: combine(colorize(), simple()),
});
 
const logger = createLogger({
  transports: [consoleTransport, infoTransport, errorTransport],
});

module.exports = logger;
