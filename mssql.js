const config = require('config');
const CreateMssqlRStream = require('./mssql/index');
const startWriter = require('./writer');


(async function () {
    const source = await CreateMssqlRStream({
        connection: {
            server: config.get('server'),
            user: config.get('user'),
            password: config.get('password'),
            options: config.get('options'),
        },
        query: config.get('query'),
        highWaterMark: 100
    });
    startWriter(source);
})();

