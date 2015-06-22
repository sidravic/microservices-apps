var Hapi = require('hapi')
var server = new Hapi.Server();

server.connection({port: 8001});




server.start(function(){
	server.log(["info"], "Node ENV " + process.env.NODE_ENV);
	server.log(["info"], "Server started on port" + server.info.port);
})