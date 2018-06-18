const EventEmitter = require('events').EventEmitter;


class BufferEvents extends EventEmitter {
    constructor(size) {
        super();
        this.size = size;
        this.buffer = [];
        this.currentSize = 0;

    }

    push(item) {
        this.buffer.push(item);
        this.currentSize++;
        this.emit('added', item);
        if (this.currentSize === this.size)
            this.emit('full');
    }

    pull() {
        const item = this.buffer.splice(0, 1);
        this.currentSize--;
        if (this.currentSize === 0)
            this.emit('empty');
        return item[0];
    }

    hasItems() {
        return this.currentSize > 0;
    }
}

module.exports = BufferEvents;
