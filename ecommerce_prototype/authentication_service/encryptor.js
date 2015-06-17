bcrypt = require("bcrypt")

bcrypt.genSalt(10, function(err, result){
		if( err )
			 throw err;
			console.log("Salt is " + result);

			bcrypt.hash("siddharth", result, function(p, h){
					console.log("Displaying progress...")
					console.log(p);

					console.log(h)

			})
})



