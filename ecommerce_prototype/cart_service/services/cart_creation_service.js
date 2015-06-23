var es = require('event-store-client');
var servicebus = require('./../config/servicebus.js');
var constants = require('./../config/constants.js');
var authenticatedEvent = constants.USER_AUTHENTICATED.event;
var Cart = require('./../models/cart.js')
var Logger = require('./../config/logger.js');

var CartCreationService = {
		init: function(){
				var self = this;
				serviceBus.listen(authenticatedEvent, 
													{durable: true, 
													 ack: true, 
													 persistent: true}, self.processEvent)
		},

		processEvent: function(event){
				// start processing event
				// create a new cart for the authToken
				var userData = event.data;
				var cart  = new Cart({authToken: userData.authToken})

				cart.save(function(err, cart){
					if (err) {
						Logger.error(["error"], err.message);
						Logger.error(["error"], err.stackTrace);
					}
					console.log("Cart created bitches");
					// complete processing event
				})

				
				
		}
}


module.exports = CartCreationService;