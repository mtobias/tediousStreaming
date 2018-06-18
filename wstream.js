const stream = require('stream');

const createWriteStream = (highWaterMark, delay, done) => {
    const writeStream = new stream.Writable({objectMode: true, highWaterMark});
    let count = 0;
    writeStream.on('finish', () => {
        done(null, count)
    });
    writeStream.on('error', (err) => {
        done(err)
    });
    writeStream._write = (chunk, encoding, done) => {
        setTimeout(() => {
            const used = process.memoryUsage().heapUsed / 1024 / 1024;
            const mem = Math.round(used * 100) / 100;
            count += chunk.length;
            console.log(`The script uses approximately ${mem} MB and proceed ${count} rows`);
            done()
        }, delay)
    };
    return writeStream
};


module.exports = createWriteStream;