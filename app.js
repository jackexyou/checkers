var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

serv.listen(2000);
console.log("server started");

// Game Logic
var Game = function(roomID){
    this.roomID = roomID;
    this.board = new Array(64);
    this.turn = 0;
}



// Room setup
var room = 0 

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
	console.log('socket connection');

	socket.on('createGame', function(data){
      socket.join('Room ' + ++room);
      console.log('room ' + room + ' created')
      socket.emit('roomID',{
				roomID: room,
			})
  });

	socket.on('joinRoom', function(data){
		socket.join('Room ' + data.roomID);
		console.log("Room ID: " + data.roomID)
		socket.emit('roomID',{
			roomID: data.roomID,
		})		
	})
	
});
