var Hapi = require('hapi')
var server = new Hapi.Server();
//var Logger = require('./config/logger.js');
var util = require('util')
var Routes = require('./config')

server.connection({port: 8002});

var loggingOptions = {
	opsInterval: 20000,
	requestPayload: true,
	responsePayload: true,
	reporters: [{
		reporter: require('good-console'),
		events: { log: '*', response: '*', debug: '*', request: '*'},
		config: { format: 'MM/DD/YY HH:mm:ss.SSS', utc: false }
	}, {
		reporter: require('good-file'),
		events: { ops: '*', response: '*', debug: '*', request: '*'},
		config: './log/application.log'
	}, {
		reporter: require('good-http'),
		events: { error: '*' },
		config: {
			endpoint: 'http://localhost:3005',
			wreck: {
				headers: { 'x-api-key' : 12345 }
			}
		}
	}]
};

server.register([{
	register: Routes,
	options: {}
}, {
	register: require('good'),
	options: loggingOptions}
], function(err){
	if (err)
		throw err;
})

server.ext('onRequest', function(request, reply){	  
		Logger.info(["info"], util.inspect(request.url) + " " + request.params + " " + util.inspect(request.payload));
})

server.start(function(){
	 console.log("Server start on port " + server.info.port)

	 var EventStoreService = require('./services/event_store_service').EventStoreService;	 
	 EventStoreService.listen();

})