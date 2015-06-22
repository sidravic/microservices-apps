var Hapi = require('hapi')
var server = new Hapi.Server();
//var moment = require('moment')
var Logger = require('./config/logger.js')
var Routes = require('./config');
var jwt = require('hapi-auth-jwt2');
var db = require('./config/db/database.js').db;
var userService = require('./services/user_service.js');
var eventStoreService = require('./services/event_store_service.js');

server.connection({port: 8000});

eventStoreService.init(function(err, es){ 
	Logger.info(["info"], "Event Store initialized.")
})


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

	
	
	// To test out the functionality uncomment the following lines 67-77
	// eventStoreService.init(function(err, es){
	// 	if(err) throw err;		
		
	// })

	// db.once('open', function(){
	// 	console.log("Database Connection Established");
	// 	userService.findByEmail('sid.ravichandran+1@gmail.com').then(function(user){						
	// 		userService.events.emit('userCreated', user);
	// 	})
	// })



})