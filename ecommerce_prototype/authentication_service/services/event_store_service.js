var es = require('event-store-client');
var Logger = require('./../config/logger.js');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var events = require('events').EventEmitter;
var util = require('util');
var eventStoreConnection = null;


console.log("Executed event Store service");
//Connection Configurations
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

// create a new event;
var createEvent = function(eventName, eventData, cb){
   var newEvent = {
       eventId: es.Connection.createGuid(),
       eventType: eventName.toString(),
       data: eventData
   }

   return newEvent;
};

var asyncCreateEvent = async(createEvent);

var onWriteCompletion = function(completedWriteEvent){
    console.log("Compelted Write event");
    console.log(completedWriteEvent);
}


// Event Service
var EventStoreService = {

    init: function(cb){
        var self = this;

        var eventStoreConnectionSuccess = function(){
            console.log(eventStoreConnection);
        };

        var connectionOptions = {
            host: eventStoreConfig.eventStore.address,
            port: eventStoreConfig.eventStore.port,
            debug: eventStoreConfig.debug,
            onConnect: eventStoreConnectionSuccess
        };

        eventStoreConnection = new es.Connection(connectionOptions);
        cb(null, self);
    },

    writeEvent: function(streamId, eventName, eventData){
        asyncCreateEvent(eventName, eventData).then(function(newEvent){
            console.log(newEvent);

            var newEvents = [];
            newEvents.push(newEvent);
            var credentials = eventStoreConfig.eventStore.credentials;

            eventStoreConnection.writeEvents(streamId,
                es.ExpectedVersion.Any,
                false,
                newEvents,
                credentials,
                onWriteCompletion)

        });
    }
};



module.exports = EventStoreService;

