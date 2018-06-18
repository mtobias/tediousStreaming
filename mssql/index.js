const stream = require('stream');
const sql = require('mssql')
const BufferEvents = require('./../bufferEvents');


//wrap tedious request
class DataSource extends stream.Readable {
    constructor({connection, query, ...rest}) {
        super({objectMode: true, ...rest});
        this.request = new sql.Request();
        this.request.stream = true;
        this.request.query(query);


        //inner buffer
        this.buffer = new BufferEvents(rest.highWaterMark || 16);
        this.tdsRequest = null;
        //pause mssql request when inner buffer is full
        this.buffer.on('full', () => {
            this.tdsRequest.pause()
        });
        //~ drain event
        this.buffer.on('empty', () => {
            this.tdsRequest.resume();
        });
        this.buffer.on('error', (err) => {
            this.emit('error', err)
        });
        this.request.on('row', (row, req) => {
            if (!this.tdsRequest)
                this.tdsRequest = req;
            this.buffer.push(row);
        })
    }


    _read(size) {
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
    sql.connect(cfg, err => {
        if (err)
            return reject(err);
        resolve(new DataSource({query, ...rest}))
    });
});


module.exports = createDataSource;