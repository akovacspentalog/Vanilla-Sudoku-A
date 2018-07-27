
const winston = require('winston');
const path = require('path');
const { logPath } = require('./configs');

// Set this to whatever, by default the path of the script.

const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'DD-MM-YYY HH:mm:ss'
  }),
  winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}${info.splat !== undefined ? `${info.splat}` : ' '}`)
);

const errorLog = winston.createLogger({
  format: customFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logPath, 'errors.log'),
      // timestamp: () => new Date(),
      level: 'error'
    }),
    new winston.transports.Console({
      colorize: true,
      level: 'error'
    })
  ]
});


const mainLog = winston.createLogger({
  format: customFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logPath, 'main.log'),
      level: 'info'
    }),
    new winston.transports.Console({
      colorize: true,
      level: 'info'
    })
  ]
});


let requestCounter = 0;
const getRequestNr = () => {
  requestCounter += 1;
  return requestCounter;
};

const logRequest = (req, res) => {
  const { url, method } = req;

  const requestNumber = getRequestNr();
  mainLog.info('\n'
      + `Incomming Request #${requestNumber}:\n`
      + `Request: ${method} ${url}\n`);

  res.on('close', () => {
    mainLog.info('\n'
        + `Response #${requestNumber}:\n`
        + `Request: ${method} ${url}\n`
        + `Response status: ${res.statusCode} ${res.statusMessage}\n`
        // + `data: ${content}\n`
        + '\n');
  });
};

module.exports = {
  errorLog,
  mainLog,
  logRequest
};
