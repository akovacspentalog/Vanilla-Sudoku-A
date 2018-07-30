const fs = require('fs');
const http = require('http');

const { logRequest, log: logger } = require('./logger');
const { srcPath } = require('./configs');
const gameFetcher = require('./GameFetcher');

const returnBadRequestResponse = (res) => {
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end();
};


const useDataFunction = (err, data, contentType, req, res) => {
  if (err) {
    returnBadRequestResponse(res);
  } else if (data) {
    res.writeHead(200, { 'Content-Type': contentType });
    res.write(data);
    res.end();
  } else {
    returnBadRequestResponse(res);
  }
};

const determineContentType = (extension) => {
  switch (extension) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.jpg':
      return 'image/jpeg';
    case '.js':
    default:
      return 'text/javascript';
  }
};

const returnFile = (path, req, res) => {
  logger.debug(`requested path: ${path}`);
  const dotIndex = path.substring(path.length - 5).lastIndexOf('.');
  const extension = dotIndex !== -1 ? path.substr(path.lastIndexOf('.')) : undefined;
  const contentType = determineContentType(extension);

  let filePath = path;
  if (!extension) {
    filePath += '.js';
  }
  logger.debug(`actual path: ${filePath}`);

  fs.readFile(filePath, (err, data) => useDataFunction(err, data, contentType, req, res));
};

const fetchGame = (req, res) => {
  logger.debug('requested a game');

  const game = gameFetcher.fetch();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(game));
  res.end();
};

http.createServer((req, res) => {
  logRequest(req, res);
  const { url, method } = req;

  if (method !== 'GET') {
    returnBadRequestResponse(res);
  } else if (url === '/') {
    returnFile(`${srcPath}/main.html`, req, res);
  } else if (url === '/getGame') {
    fetchGame(req, res);
  } else {
    returnFile(`${srcPath + url}`, req, res);
  }
}).listen(8080);

logger.info('Server started!');
