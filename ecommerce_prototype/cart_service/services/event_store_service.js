var es = require('event-store-client');
var Logger = require('./../config/logger.js');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var events = require('events').EventEmitter;
var util = require('util');
var CartEventsCatchUpService = require('./cart_events_catchup_service.js');
var eventStoreConnection = null;

var eventStoreConfig = {
    eventStore: {
        address: '127.0.0.1',
        port: 1113,
        stream: 'cartCreationStream',
        credentials: {
            username: 'admin',
            password: 'changeit'
        }
    },
    debug: false
};



var EventStoreService = {
		init: function(cb){
				var self = this;

				var eventStoreConnectionSuccess = function(){
					Logger.info(['info'], "Event Store connected");
					cb(null, true);
				};

				var connectionOptions = {
					host: eventStoreConfig.eventStore.address,
					port: eventStoreConfig.eventStore.port,
					debug: false,
					onConnect: eventStoreConnectionSuccess
				};

				eventStoreConnection = new es.Connection(connectionOptions);				
		},

		listen: function(){
			var self = this;
			
			self.init(function(err, connectionStatus){
					if(connectionStatus) {						
						self.launchCatchupSubscription();
						console.log("Connection to eventStore: " + new Date());	
					}												
			})
		},

		launchCatchupSubscription: function(){
				console.log(eventStoreConfig);				
				CartEventsCatchUpService.start(eventStoreConfig, eventStoreConnection);
		}
}

module.exports.EventStoreService = EventStoreService;

