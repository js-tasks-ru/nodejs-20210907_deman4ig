const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._reminder = options.limit;
  }

  _transform(chunk, encoding, callback) {
    if (this._reminder >= chunk.byteLength) {
      this._reminder -= chunk.byteLength;
      callback(null, chunk);
    } else {
      this.destroy(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
