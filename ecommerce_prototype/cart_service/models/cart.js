var mongoose = require('./../config/db/database.js').mongoose;
var cartItem = require('./cart_item.js').CartItem;
var cartItemSchema = require('./cart_item.js').cartItemSchema;
var async = require('asyncawait/async');
var await = require('asyncawait/await');


var CartSchema = mongoose.Schema({
	id: {type: mongoose.Schema.Types.ObjectId, index: true},
	authToken: {type: String },
	cartItems: {type: [cartItemSchema]},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date}
}, {strict: true})

var Cart = mongoose.model("Cart", CartSchema);

Cart.prototype.addToCart = function(cartItem, cb) {
		this.cartItems.addToSet(cartItem, {}, cb);
}


module.exports = Cart;




