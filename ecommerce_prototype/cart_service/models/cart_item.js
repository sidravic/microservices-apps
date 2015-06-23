var mongoose = require('./../config/db/database.js').mongoose;

var CartItemSchema = mongoose.Schema({
	id: {type: mongoose.Schema.Types.ObjectId, index: true},
	sku: {type: String, index: true},
	itemName: {type: String},
	quantity: {type: Number, default: 1},
	createdAt: {type: Date, default: new Date()}
})

var CartItem = function(params){
	if(params == undefined)
		params = {};

	this._id = mongoose.Types.ObjectId(),
	this.itemName = params.itemName
	this.sku = params.sku;
	this.quantity = (params.qantity) ||  1;
	this.createdAt = new Date();

	return {
					sku: this.sku,
					quantity: this.quantity,
					createdAt: this.createdAt,
					_id: this._id,
					itemName: this.itemName
				 };
}


module.exports.CartItem = CartItem;
module.exports.CartItemSchema = CartItemSchema;