var Constants = require('./../config/constants.js');
var authenticatedStream = Constants.USER_AUTHENTICATED.stream;
var authenticatedEvent = Constants.USER_AUTHENTICATED.event;
var servicebus = require('./../config/servicebus.js');
var CartEventsStreamSubscribeService = require('./cart_events_stream_subscribe_service');
var eventStoreConfig = null;
var eventStoreConnection = null;


// Checks if all events have been caught up?
var onCatchupStreamCompletedCb = function(completed){
		console.log(completed);
		if(!completed.isEndOfStream){
				CartEventsCatupService.catchup(authenticatedStream, completed.nextEventNumber, 
																			 completed.lastEventNumber);
		}else{			
			console.log("Catch up stream completed.");
			CartEventsStreamSubscribeService.start(authenticatedStream, 
																						 eventStoreConfig, 
																						 eventStoreConnection);
			console.log("Subscribed to stream");
		}
};

var onEventsAppearCb = function(event){
	if(event.streamId == authenticatedStream)
		servicebus.send(authenticatedEvent, authenticatedEvent);
}


var CartEventsCatchupService = {
		start: function(esConfig, esConnection){	
			console.log("Launching eventstore catchup events process.")									
			eventStoreConfig = esConfig;
			eventStoreConnection = esConnection;
			var self = this;			
			var streamStartsAt = 0;
			var streamUpto = 50;
			var requireMaster = false;
			var resolveLinksTo = true;
			
			self.catchup(authenticatedStream, streamStartsAt, streamUpto, resolveLinksTo, requireMaster);			
		}, 

		catchup: function(stream, streamStartAt, streamUpto, resolveLinksTo, requireMaster){				
				eventStoreConnection.readStreamEventsForward(stream,
																									 streamStartAt,
																									 streamUpto,
																									 resolveLinksTo,
																									 requireMaster,
																									 onEventsAppearCb,
																									 eventStoreConfig.eventStore.credentials,
																									 onCatchupStreamCompletedCb);
		}
};


module.exports = CartEventsCatchupService;