var Hapi = require('hapi')
var server = new Hapi.Server();
//var moment = require('moment')
//var Path = require('path');
//var Logger = require('./config/logger.js');
var Routes = require('./config');
//var Good = require('good');
var jwt = require('hapi-auth-jwt2');
var userService = require('./services/user_service.js');

server.connection({port: 8000});

/* logging options */
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
},{
	register: require('good'),
	options: loggingOptions
},{
	register: jwt,
	options: {}
}], function(err){
	if(err)
		throw err;


	server.auth.strategy('jwt', 'jwt', true, {
		key: 'piperatthegatesofdawniscallingyouhisway',
		validateFunc: userService.validate
	})
});


//Logger.info("Bucker Logging here")
server.log(["info"], "Launching Server...");

server.start(function(){
	server.log(["info"], "Node ENV " + process.env.NODE_ENV);
	server.log(["info"], "Server started on port" + server.info.port);
})