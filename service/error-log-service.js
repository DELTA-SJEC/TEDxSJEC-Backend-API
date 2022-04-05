const { createLogger, transports, format } = require("winston");
const path = require("path");

const customLogger = createLogger({
  transports: [
    new transports.File({
      filename: path.join(__dirname, "../log/request-logs/info.log"),
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      filename: path.join(__dirname, "../log/request-logs/error.log"),
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = { customLogger };
