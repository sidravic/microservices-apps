var constants = require('./../config/constants')
var eventStoreConfig = null;
var eventStoreConnection = null;
var subscriptionId = null;

var onEventAppearedCb = function(event){
	console.log("Subscription event arrived");
	console.log(event);

}

var onSubscriptionConfirmedCb = function(c){
	console.log("Subscription Confirmed")
	console.log(c);
}

var onSubscriptionDroppedCb = function(d){
	console.log("Subscription Dropped");
	console.log(d);
}

var CartEventsStreamSubscribeService = {
		start: function(authenticatedStream, esConfig, esConnection){
			  var self = this;			  
		    eventStoreConfig = esConfig;
		    eventStoreConnection = esConnection;
		    stream = authenticatedStream;
		    resolveLinkTo = true


		    self.subscribe(stream, resolveLinkTo, onEventAppearedCb, onSubscriptionConfirmedCb, onSubscriptionDroppedCb, eventStoreConfig.eventStore.credentials);
		},

		subscribe: function(streamId, resolveLinkTo, onEventAppearedCb, onSubscriptionConfirmedCb,								onSubscriptionDroppedCb, credentials){	


			console.log("Subscribing to " + streamId);
			eventStoreConnection.subscribeToStream(streamId, resolveLinkTo, onEventAppearedCb, onSubscriptionConfirmedCb, 
																						onSubscriptionDroppedCb, credentials);
		}
}

module.exports = CartEventsStreamSubscribeService