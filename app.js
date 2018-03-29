var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log("server started");


var room = 0 

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
	console.log('socket connection');

	socket.on('createGame', function(data){
      socket.join('Room ' + ++room);
      console.log('room ' + room + ' created')
  });

	socket.on('happy', function(data){
		console.log("happy because" + data.reason)
	})

});
