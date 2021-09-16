const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._reminder = '';
  }

  _transform(chunk, encoding, callback) {
    let startPos = 0;
    let finishPos = 0;

    if (!chunk.includes(os.EOL)) {
      this._reminder += chunk;
      callback();
      return;
    }

    if (this._reminder.length > 0) {
      chunk = this._reminder + chunk;
      this._reminder = '';
    }

    while (chunk.indexOf(os.EOL, startPos) !== -1) {
      finishPos = chunk.indexOf(os.EOL, startPos);
      this.push(chunk.slice(startPos, finishPos));
      startPos = finishPos + 1;
    }

    this._reminder += chunk.slice(finishPos + 1);
    callback();
  }

  _flush(callback) {
    callback(null, this._reminder);
  }
}

module.exports = LineSplitStream;
