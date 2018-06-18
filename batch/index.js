const stream = require('stream');

class Batch extends stream.Transform {
    constructor(size) {
        super({objectMode: true});
        this.buffer = [];
        this.limit = size;
        this.size = 0;
    }

    _transform(chunk, encoding, callback) {
        this.buffer.push(chunk);
        this.size += 1;
        if (this.size === this.limit) {
            this.push(this.buffer);
            this.buffer = [];
            this.size = 0;
            return callback()
        }
        callback()
    }

    _flush(callback) {
        this.push(this.buffer);
        this.buffer = [];
        this.size = 0;
        callback()
    }
}

module.exports = Batch;