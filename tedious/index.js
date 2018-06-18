const stream = require('stream');
const {Connection, Request} = require('tedious');
const BufferEvents = require('../bufferEvents');


//wrap tedious request
class DataSource extends stream.Readable {
    constructor({connection, query, ...rest}) {
        super({objectMode: true, ...rest});
        this.connection = connection;
        this.connection.on('error', (err) => {
            this.emit('error', err)
        });
        this.request = new Request(query, (err) => {
            if (err)
                return this.emit('error', err);
            this.buffer.push(null)
        });
        this.started = false;
        //inner buffer
        this.buffer = new BufferEvents(rest.highWaterMark || 16);
        //pause mssql request when inner buffer is full
        this.buffer.on('full', () => {
            this.request.pause()
        });
        //~ drain event
        this.buffer.on('empty', () => {
            this.request.resume();
        });
        this.buffer.on('error', (err) => {
            this.emit('error', err)
        });
        this.request.on('row', (columns) => {
            this.buffer.push(columns)
        })
    }


    _read(size) {
        if (!this.started) {
            this.connection.execSql(this.request);
            this.started = true;
        }

        if (this.buffer.hasItems()) {
            this.push(this.buffer.pull())
        } else {
            this.buffer.once('added', (element) => {
                if (element)
                    return this.push(this.buffer.pull());
                this.push(null)
            })
        }
    }
}


const createDataSource = ({query, connection, ...rest}) => new Promise((resolve, reject) => {
    const cfg = {...connection};
    const conn = new Connection(cfg);
    conn.on('connect', (err) => {
        if (err)
            return reject(err);
        resolve(new DataSource({connection: conn, query, ...rest}))
    })
});


module.exports = createDataSource;