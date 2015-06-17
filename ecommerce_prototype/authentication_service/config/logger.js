var bucker = require('bucker');

var Logger = bucker.createLogger({
    app: 'log/application.log',
    console: true,
    level: "debug"
});


module.exports = Logger;


