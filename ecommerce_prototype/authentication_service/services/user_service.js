var crypto       = require('crypto')
var jsonWebToken = require('jsonwebtoken');
var signingKey   = "piperatthegatesofdawniscallingyouhisway"
var User         = require('./../models/user.js')
var async        = require('asyncawait/async');
var await        = require('asyncawait/await');
var util         = require('util');
var events       = require('events');
var eventStoreService = require('./event_store_service.js');
var eventConstants = require('./../config/events.js');
var Logger       = require('./../config/logger.js');


var UserService = {
    validate: function(decoded, request, cb){
       UserService.isAuthTokenValid(decoded.id.toString(), request.headers.authorization, function(err, isValid){
           if (err) cb(err, false);
           if(isValid)
             cb(null, true);
           else
             cb(null, false);
       });
    },

    generateJSONWebToken: function(user){
       var jwebToken =  jsonWebToken.sign(user.asJSON(), signingKey)
       return jwebToken;
    },

    /* High level method that verifies Auth Token validity */
    isAuthTokenValid: function(userId, authToken, cb){
        var self = this;

        var verifyToken = function(err, user){
            if(err)
                cb(err, false);
            else {
                if (self.authTokenExists(user, authToken))
                    cb(null, true);
                else
                    cb(null, false);
            }
        }
        User.findById(userId, verifyToken);
    },

    /* Checks if token exists within the user object */
    authTokenExists: function(user, authToken){
        if(user.authTokens.indexOf(authToken) != -1)
            return true;
        else
            return false;
    },

    findByEmail: async(function(value, cb){
        return await(User.findOne({email: value}))
    }),

    storeUserCreatedEvent: function(user){
        eventStoreService.writeEvent(eventConstants.USER_CREATED.stream, eventConstants.USER_CREATED.event, user )      
    },

    storeAuthenticatedEvent: function(userData){
        var eventConstants = require('./../config/events.js');
        eventStoreService.writeEvent(eventConstants.USER_AUTHENTICATED.stream, 
            eventConstants.USER_AUTHENTICATED.event, {user: userData.user,
                                                      authToken: userData.authToken
                                                     });
    }
};

UserService.events = new events.EventEmitter

UserService.events.on(eventConstants.USER_CREATED.event, function(user){    
    Logger.info(["info"], "User Created " + user.id.toString());    
    UserService.storeUserCreatedEvent(user);
})

UserService.events.on(eventConstants.USER_AUTHENTICATED.event, function(userData){
    debugger;
    Logger.info(["info"], "User Authenticated " + userData.user.email.toString());
    UserService.storeAuthenticatedEvent(userData);
});

module.exports = UserService;