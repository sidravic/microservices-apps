var crypto = require('crypto')
var jsonWebToken = require('jsonwebtoken');
var signingKey = "piperatthegatesofdawniscallingyouhisway"
var User = require('./../models/user.js')

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
    }
};

module.exports = UserService;