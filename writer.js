const BatchStream = require('./batch');
const createWStream = require('./wstream');
const startWriter = (readableStream) => {
    const batcher = new BatchStream(10);
    //10 - buffer suze
    //50 - emulate delay
    const wStream = createWStream(10, 50, (err) => {
        if (err) {
            console.error(err);
            process.exit(1)
        }
        console.log('ready')

    });
    batcher.on('error', (err) => {
        console.error(err);
        process.exit(1)
    });
    //get data, group it and write
    readableStream.pipe(batcher).pipe(wStream);
};


module.exports = startWriter;