const url = require('url');
const http = require('http');
const path = require('path');
const {promisify} = require('util');
const fs = require('fs');

const server = new http.Server();
const rm = promisify(fs.rm);

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.split('/').length > 1) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      rm(filepath).then(() => res.end()).catch((e) => {
        if (e.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('File not found');
        } else {
          res.statusCode = 500;
          res.end('Something went wrong');
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
