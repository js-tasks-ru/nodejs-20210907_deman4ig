const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const util = require('util');

const server = new http.Server();
const uploadSizeLimit = 1048576;

server.on('request', async (req, res) => {
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
      const buffers = [];
      const writeFile = util.promisify(fs.writeFile);
      let currentSize = 0;

      for await (const chunk of req) {
        currentSize += chunk.byteLength;
        if (currentSize < uploadSizeLimit) {
          buffers.push(chunk);
        } else {
          res.statusCode = 413;
          res.end();
        }
      }

      const data = Buffer.concat(buffers).toString();
      try {
        await writeFile(filepath, data, {flag: 'wx'});
      } catch (e) {
        res.statusCode = 409;
        res.end();
      }

      res.statusCode = 201;
      res.end();

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
