
var Joi = require('joi');
var Boom = require('boom');
var _ = require('lodash');
var User = require('./../models/user.js');
var Promise = require('bluebird');
var UserService = require('./../services/user_service.js');

var buildErrorMessage = function(err, cb){
    var errors = []
    _.map(err.details, function(error) {
        errors.push(error.message)
    })

    cb(errors.join("."));
}

var buildErrorMessageAsync = Promise.promisify(buildErrorMessage);


module.exports.create = {
    auth: false,
    description: 'Creates a new user',
    handler: function(request, reply){

        var userSchema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().alphanum().min(6).max(16).required(),
            name: Joi.string().required()
        });

        var userParams = {
            email: request.payload.email,
            password: request.payload.password,
            name: request.payload.name
        };


        Joi.validate(userParams, userSchema, function(err, value){
            if(err){
              buildErrorMessage(err, function(errorMessage){
                  reply(Boom.badRequest(errorMessage)).
                       type('application/json');
              })

            }else{
                var password = userParams.password;
                delete userParams.password

                var user = new User(userParams)
                user.encryptPasswordAsync(password, function(digest, salt){
                    user.encryptedPassword = digest;
                    user.s = salt;

                    user.save(function(err, savedUser){
                        if(err) {
                            return reply(Boom.badRequest(err))
                        }
                        else {
                            reply({user: savedUser.asJSON()})
                        }

                    })
                })
            }
        });

    }

}

module.exports.get = {
    description: 'Gets user information',
    handler: function(request, reply){
        var response = function(err, user){
            if(err)
                reply(Boom.internal("Something went wrong. We're looking into it."))
            else
                reply({user: user.asJSON()}).type('application/json')
        };

        User.findById(request.params.id, response);
    }
}


module.exports.auth = {
    auth: false,
    description: 'Authenticates a user',
    handler: function(request, reply){
       var email = request.payload.email;
       var password = request.payload.password;

       var authParams = {
           email: email,
           password: password
       };

       var authSchema = {
            email: Joi.string().email().required(),
            password: Joi.string().required()
       }

       Joi.validate(authParams, authSchema, function(err, value){
           if(err){
               buildErrorMessage(err, function(errorMessage){
                   reply(Boom.badRequest(errorMessage)).
                       type('application/json');
               })
           }else{
               User.findOne({email: authParams.email}, function(err, user){
                   if(err)
                        reply(Boom.unauthorized('Invalid username or password'))
                   else{
                       User.verifyPassword(user, authParams.password, function(err, authorized){
                            if(err) reply(Boom.internal("Something went wrong."));

                            if(authorized){
                               var jsonWebToken = UserService.generateJSONWebToken(user);
                               user.authTokens.addToSet(jsonWebToken);
                               user.save(function(err, savedUser) {
                                   if (err)
                                       reply(Boom.internal("Something went wrong"))
                                   else {
                                       UserService.events.emit('userAuthenticated', {user: user, authToken: jsonWebToken})                              
                                       reply({
                                           user: savedUser.asJSON(),
                                           authorizationToken: jsonWebToken
                                       })
                                   }
                               })
                            }
                            else{
                                reply(Boom.badRequest("invalid username or password"));
                            }
                       })
                   }

               })
           }
       })
    }
}