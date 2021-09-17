const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();
const uploadSizeLimit = 1048576;

server.on('request', (req, res) => {
  const reqURL = new url.URL(req.url, `http://${req.headers.host}`);
  const pathname = reqURL.pathname.slice(1);

  if (pathname.split('/').length > 1) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
      const limitSizeStream = new LimitSizeStream({limit: uploadSizeLimit});

      writeStream.on('error', (err) => {
        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File exists');
        } else {
          res.statusCode = 500;
          res.end('Internal error');
        }
      });

      limitSizeStream.on('error', (err) => {
        if (err.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('File is too large');
        } else {
          res.statusCode = 500;
          res.end('Internal error');
        }
        writeStream.destroy();
        fs.unlink(filepath, () => {});
      });

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('File uploaded');
      });

      req.pipe(limitSizeStream).pipe(writeStream);

      req.on('aborted', () => {
        limitSizeStream.destroy();
        writeStream.destroy();
        fs.unlink(filepath, () => {});
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
