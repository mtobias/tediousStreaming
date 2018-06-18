const stream = require('stream');
const CreateDataSource = require('./source/index');
const BatchStream = require('./batch/index');
let count = 0;


const writeStream = new stream.Writable({objectMode: true, highWaterMark: 10});

//emulate a slow receiver (2000 ms for 1 chunk of data)
writeStream._write = (chunk, encoding, done) => {
    setTimeout(() => {
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        const mem = Math.round(used * 100) / 100;
        count += chunk.length;
        console.log(`The script uses approximately ${mem} MB and proceed ${count} rows`);
        done()
    }, 2000)
};


(async function () {
    const source = await CreateDataSource({
        connection: {
            server: "server",
            userName: "userName",
            password: "password",
            options: {
                encrypt: true
            }
        },
        query: 'SELECT * FROM DB.dbo.VeryLargeTable WITH ( NOLOCK )',
        highWaterMark: 100
    });
    //group items into chunk
    const batcher = new BatchStream(10);
    writeStream.on('finish', () => {
        console.log('complete')
    });
    writeStream.on('error', (err) => {
        console.error(err);
        process.exit(1)
    });
    batcher.on('error', (err) => {
        console.error(err);
        process.exit(1)
    });
    //get data, group it and write
    source.pipe(batcher).pipe(writeStream);

})();

