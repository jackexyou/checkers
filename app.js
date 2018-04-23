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
    this.board = 
    	["r","","r","","r","","r","",
    	"","r","","r","","r","","r",
    	"r","","r","","r","","r","",
    	"","","","","","","","",
    	"","","","","","","","",
    	"","b","","b","","b","","b",
    	"b","","b","","b","","b","",
    	"","b","","b","","b","","b"];
}

Game.prototype.available = function(p) {
	var av = new Array(4);
	var x = (p % 8);
	var y = Math.floor(p / 8);

	// top left
	if ((x > 0) && (y > 0)) {
		if (this.board[p - 9]) {
			if ((x > 1) && (y > 1) && !this.board[p - 18]) {
				av[0] = p - 18
			}
		} else {
			av[0] = p - 9
		}
	} 

	// top right
	if ((x < 7) && (y > 0)) {
		if (this.board[p - 7]) {
			if ((x < 6) && (y > 1) && !this.board[p - 14]) {
				av[1] = p - 14
			}	
		} else {
			av[1] = p - 7
		}
	}

	// bottom left
	if ((x > 0) && (y < 7)) {
		if (this.board[p + 7]) {
			if ((x > 1) && (y < 6) && !this.board[p + 14]) {
				av[2] = p + 14
			}	
		} else {
			av[2] = p + 7
		}
	}

	// bottom right
	if ((x < 7) && (y < 7)) {
		if (this.board[p + 9]) {
			if ((x < 6) && (y < 6) && !this.board[p + 18]) {
				av[3] = p + 18
			}	
		} else {
			av[3] = p + 9
		}	
	}

	// left limit 
	if (x == 0) {
		av[0] = ""
		av[2]	= ""
	}

	// right limit
	if (x == 7) {
		av[1] = ""
		av[3]	= ""
	}

	// top limit
	if (y == 0) {
		av[0] = ""
		av[1] = ""
	}

	// bottom limit
	if (y == 7) {
		av[2] = ""
		av[3] = ""
	}


	// piece id

	if (this.board[p] == "b") {
		av[2] = ""
		av[3] = ""
	} else if (this.board[p] == "r") {
		av[0] = ""
		av[1] = ""
	} 

	return av
}


// Room setup
var room = 0 
var games = []
var g = new Game(room);

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
	console.log('socket connection');
	


	socket.on('createGame', function(data){
    socket.join('Room ' + ++room);
    
    games.push(g)
    console.log('room ' + room + ' created')
    socket.emit('roomID',{
			roomID: room,
		})
  });

  socket.on("position", function(data){
  	console.log(data.position)
  	var moves = g.available(data.position)
  	console.log(moves)
  	socket.emit("moves", {
  		moves: moves
  	})
  });

  socket.on("action", function(data){
  	console.log(data.action)
  });

	// socket.on('joinRoom', function(data){
	// 	socket.join('Room ' + data.roomID);
	// 	console.log(games[data.roomID - 1])
	// 	console.log("Room ID: " + data.roomID)
	// 	socket.emit('roomID',{
	// 		roomID: data.roomID,
	// 	})		
	// })
	
});
