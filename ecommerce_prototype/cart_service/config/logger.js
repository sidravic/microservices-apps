var Bucker = require('bucker')

var Logger = Bucker.createLogger({
	app: 'log/application.log',
	level: 'debug',
	console: { 
			color: true
	},
	timestamp: 'HH:mm:ss SSS',
	accessFormat: ':time :level :method :status :url'
})


module.exports = Logger;