const config = require('config');
const CreateTediousRStream = require('./tedious/index');
const startWriter = require('./writer');


(async function () {
    const source = await CreateTediousRStream({
        connection: {
            server: config.get('server'),
            userName: config.get('user'),
            password: config.get('password'),
            options: config.get('options'),
        },
        query: config.get('query'),
        highWaterMark: 100
    });
    startWriter(source);
})();

