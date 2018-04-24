var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

serv.listen(process.env.PORT || 2000)
console.log("server started");

// Game Logic
var Game = function(roomID){
    this.roomID = roomID;
    this.turn = 0;
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

// Check for available moves

Game.prototype.available = function(p) {
	var av = new Array(4);
	var x = (p % 8);
	var y = Math.floor(p / 8);
	var colour = this.board[p].substring(0,1);

	// top left
	if ((x > 0) && (y > 0)) {
		if ((this.board[p - 9].substring(0,1) == colour)) {
			av[0] = "";
		} else if (this.board[p - 9]) {
			if ((x > 1) && (y > 1) && !this.board[p - 18]) {
				av[0] = p - 18;
			}
		} else {
			av[0] = p - 9;
		}

	} 

	// top right
	if ((x < 7) && (y > 0)) {
		if (this.board[p - 7].substring(0,1) == colour) {
			av[1] = "";
		} else if (this.board[p - 7]) {
			if ((x < 6) && (y > 1) && !this.board[p - 14]) {
				av[1] = p - 14;
			}	
		} else {
			av[1] = p - 7;
		}
	}

	// bottom left
	if ((x > 0) && (y < 7)) {
		if (this.board[p + 7].substring(0,1) == colour) {
			av[2] = "";
		} else if (this.board[p + 7]) {
			if ((x > 1) && (y < 6) && !this.board[p + 14]) {
				av[2] = p + 14;
			}	
		} else {
			av[2] = p + 7;
		}
	}

	// bottom right
	if ((x < 7) && (y < 7)) {
		if (this.board[p + 9].substring(0,1) == colour) {
			av[3] = ""
		} else if (this.board[p + 9]) {
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

// Change the board state

Game.prototype.action = function(arr) {
	ori_pos = arr[0]
	new_pos = arr[1]
	if (Math.abs(ori_pos, new_pos) > 9) {
		cap_pos = (new_pos - ori_pos) / 2
		this.board[ori_pos + cap_pos] = ""
	}

	if ((this.board[ori_pos] == "b") && (new_pos < 8)) {
		this.board[new_pos] = "bk"
	} else if ((this.board[ori_pos] == "r") && (new_pos > 55)) {
		this.board[new_pos] = "rk"
	} else {
		this.board[new_pos] = this.board[ori_pos]
	}

	this.board[ori_pos] = ""

	
}


// Global
var room = 1;
var games = []
g = new Game(room);

// socket connection

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
	console.log('connected');

	// Create game

	socket.on('createGame', function(data) {
		g = new Game(room);

    socket.join('Room ' + room);
    console.log('room ' + room + ' created')
    games.push(g)
    
    socket.emit('roomID',{
			roomID: room,
		})

		socket.emit("board", {
	  	board:g.board
	  });

	  socket.emit("playerID", {
	  	playerID: "black"
	  })

	  room++;
  });

  // Join Room

  socket.on('joinRoom', function(data){
  	let name = 'Room ' + data.roomID;
  	let r = io.sockets.adapter.rooms[name]
  	console.log(r)
  	if (r && r.length == 1) {
			socket.join(name);
			g = games[data.roomID - 1]
			if (g) {
				io.sockets.emit("board", {
			  	board:g.board
			  });
			}
			
			console.log("Room ID: " + data.roomID)
			socket.emit('roomID',{
				roomID: data.roomID,
			})

			socket.emit("playerID", {
		  	playerID: "black"
		  })
		} else {
			socket.emit('err', {
				message: 'Sorry, The room is full!'
			});
		}
	})

	// Move Processing

  socket.on("position", function(data){
  	let moves = g.available(data.position)
  	console.log(moves) 
  	socket.emit("moves", {
  		moves: moves
  	})
  });


  socket.on("action", function(data){
  	g.action(data.action)
  	io.sockets.emit("board", {
	  	board:g.board
	  });
  });

	
	
});
