const fs = require('fs');
const http = require('http');

const PATH_TO_SRC = '../src';

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
  const dotIndex = path.substring(path.length - 5).lastIndexOf('.');
  const extension = dotIndex !== -1 ? path.substr(path.lastIndexOf('.')) : undefined;
  const contentType = determineContentType(extension);

  let filePath = path;
  if (!extension) {
    filePath += '.js';
  }

  fs.readFile(filePath, (err, data) => useDataFunction(err, data, contentType, req, res));
};

http.createServer((req, res) => {
  const { url, method } = req;

  if (method !== 'GET') {
    returnBadRequestResponse(res);
  } else if (url === '/') {
    returnFile(`${PATH_TO_SRC}/main.html`, req, res);
  } else {
    returnFile(`${PATH_TO_SRC + url}`, req, res);
  }
}).listen(8080);
