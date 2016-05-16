var net = require('net'),

	sockets;

function createServer(port) {

	// Setup.
	sockets = [];

	var server = net.createServer(function(socket) {

		// Handle connection.
		sockets.push(socket);

		clientCount();

		// Handle data.
		socket.on('data', function(data) {
			broadcast(socket, data.toString());
		});

		// Connection ended.
		socket.on('end', function() {
			console.log('Client hung up.');

			var index = sockets.indexOf(socket);

			if(index > -1) {
				sockets.splice(index, 1);
			}

			clientCount();
		});
	});

	server.listen(port, function() {
		console.log('Server listening on port: ' + port);
	});

	return server;
}

function broadcast(sendingSocket, message) {
	sockets.forEach(function(socket) {
		if(socket != sendingSocket) {
			socket.write(message);
		}
	});
}

function clientCount() {
	console.log('Connected clients: ' + sockets.length);
}

var server = createServer(8911);
