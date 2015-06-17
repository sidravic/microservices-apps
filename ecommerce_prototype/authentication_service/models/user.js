
var Promise = require('bluebird');
var Logger = require('./../config/logger.js');
var mongoose = require('./../config/db/database.js').mongoose;
var crypto = require('crypto')
var validator = require('validator');
var bcrypt = require('bcrypt');

var genSalt = Promise.promisify(bcrypt.genSalt)
var createHash = Promise.promisify(bcrypt.hash)


var emailFormatValidator = function(email){
    return validator.isEmail(email);
}

//Logger.info(mongoose);

var userSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    email: {type: String, required: true, validate: emailFormatValidator, unique: true},
    encryptedPassword: {type: String, required: true},
    isActive: {type: Boolean, required: true, default: false},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date},
    authTokens: {type: [], index: true},
    s: {type: String}
},{strict: true});

userSchema.path('email').index({unique: true})

var User = mongoose.model("User", userSchema);

User.prototype.asJSON = function(){
    return {
        id: this._id.toString(),
        name: this.name,
        email: this.email,
        isActive: this.isActive,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }
}

User.prototype.encryptPassword = function(password, cb){
    var timestamp = Date.now().toString()
    var salt = crypto.createHash('sha1').update(timestamp).digest('hex')
    var encryptedPassword = crypto.createHash('sha256').update(password + salt).digest('hex')
    cb(salt, encryptedPassword);
}

User.prototype.encryptPasswordAsync = function(password, cb){
    return genSalt().then(function(salt){
        return createHash(password, salt).then(function(digest){
            cb(digest, salt);
        });
    })
}

User.prototype.generateAuthorizationToken = function(cb){
    try {
        var timestamp = Date.now()
        var id = this._id;
        var authToken = crypto.createHash('md5').update(timestamp.toString() + "_" + id.toString()).digest('hex');
        cb(null, authToken);

    }catch(ex){
        server.log(["error"], ex);
        cb(true, ex)
    }

}

User.verifyPassword = function(user, password, cb){
    createHash(password, user.s).then(function(digest){
        try{
            if (digest == user.encryptedPassword)
                cb(false, true)
            else
                cb(false, true)
        }catch(ex){
            Logger.error(["error"], ex.stack);
            cb(true, ex);
        }
    })
}

module.exports = User;