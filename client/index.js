var net = require('net'),
	readline = require('readline'),

	socket,
	rl,
	connectionAttempts;

setupInput();

connect();

function connect () {

	if(!connectionAttempts) {
		connectionAttempts = 0;
	}

	connectionAttempts++;

	socket = net.createConnection(8911);

	// Connection failed.
	socket.on('error', function() {
		console.log('Connection attempt ' + connectionAttempts + ' failed.');

		if(connectionAttempts < 5) {
			setTimeout(connect, 5000);
		}
	});

	// Connected.
	socket.on('connect', function() {
		console.log('Connected to server.')
		rl.resume();
	});

	// Received data.
	socket.on('data', function(data) {
		console.log('>> ' + data.toString());
	});

	// Connection ended.
	socket.on('end', function() {
		console.log('Server hung up.');

		rl.pause();

		console.log('Trying to reconnect.');

		connectionAttempts = 0;
		connect();
	});
}

function setupInput() {
	rl = readline.createInterface(process.stdin, process.stdout);

	rl.on('line', function(line) {
		socket.write(line);
	});

	rl.pause();
}
