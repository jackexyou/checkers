board = ['r','b', 'r','bk','rk'];
function displayPieces() {
	for (var i = 0; i < board.length; i++) {
			var t = 10 + Math.floor(i / 8) * 80;
			var l = 10 + (i % 8) * 80;
 		if (board[i] == "rn") {
 			var div = document.createElement('div');
 			div.className = "checker white_checker";
 			div.style = "top: "+ t + "px; left: " + l + "px;"
 			$("#table").append(div)

 		} else if (board[i] == "b"){

 			var div = document.createElement('div');
 			div.className = "checker black_checker";
 			div.style = "top: "+ t + "px; left: " + l + "px;"
 			$("#table").append(div)

 		} else if (board[i] == "r"){

 			var div = document.createElement('div');
 			div.className = "checker white_checker";
 			div.style = "top: "+ t + "px; left: " + l + "px;"
 			div.style.border = "4px solid #FFFF00";
 			$("#table").append(div)

 		} else if (board[i] == "bk"){

 			var div = document.createElement('div');
 			div.className = "checker black_checker";
 			div.style = "top: "+ t + "px; left: " + l + "px;"
 			div.style.border = "4px solid #FFFF00";
 			$("#table").append(div)
 			
 		}

 	}

}

displayPieces();
	

var socket = io();

socket.on("roomID", function(data) {
 	document.getElementById('current-room').innerHTML = data.roomID
})

var createGame = function(){
	 socket.emit("createGame", {

	 })
}

var form = document.getElementById('room');
form.addEventListener('submit', function(e) {
	var input = document.getElementById('room-input')
	var value = input.value;
	socket.emit("joinRoom", {
	 	roomID: value
	})

	e.preventDefault();
})