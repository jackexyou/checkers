// GLOBAL 

var board = [];
var selected = 0;



// helper functions

function displayPieces() {
	for (var i = 0; i < 64; i++) {
			var t = 10 + Math.floor(i / 8) * 80;
			var l = 10 + (i % 8) * 80;
 		if (board[i] == "r") {
 			var div = document.createElement('div');
 			div.id = "c" + i 
 			div.className = "checker white_checker";
 			div.style = "top: "+ t + "px; left: " + l + "px;"
 			$("#table").append(div)

 		} else if (board[i] == "b"){

 			var div = document.createElement('div');
 			div.id = "c" + i 
 			div.className = "checker black_checker";
 			div.style = "top: "+ t + "px; left: " + l + "px;"
 			$("#table").append(div)

 		} else if (board[i] == "rk"){

 			var div = document.createElement('div');
 			div.id = "c" + i 
 			div.className = "checker white_checker";
 			div.style = "top: "+ t + "px; left: " + l + "px;"
 			div.style.border = "4px solid #FFFF00";
 			$("#table").append(div)

 		} else if (board[i] == "bk"){

 			var div = document.createElement('div');
 			div.id = "c" + i 
 			div.className = "checker black_checker";
 			div.style = "top: "+ t + "px; left: " + l + "px;"
 			div.style.border = "4px solid #FFFF00";
 			$("#table").append(div)
 			
 		}

 	}

}


function highlight(n) {
	$("#p" + n).css({"background": "#704923", "cursor": "pointer"});
	$("#p" + n).addClass("move")
}

function unhighlight() {
	$(".square").removeAttr("style")
	$(".square").removeClass("move")
}


	

var socket = io();

socket.on("roomID", function(data) {
 	document.getElementById('current-room').innerHTML = data.roomID
})

var createGame = function(){
	 socket.emit("createGame", {

	 })
}

// movement


$(document).on("click", ".checker", function(){
	unhighlight()
	selected = parseInt(event.target.id.substring(1))
	socket.emit("position", {
		position: selected
	});

	socket.on("moves", function(data){
  	for (let i = data.moves.length - 1; i >= 0; i--) {
  		if (data.moves[i]){
  			highlight(data.moves[i])
  		}
  	}
  });
});

$(document).on("click", ".move",function(){
	let m = parseInt(event.target.id.substring(1))
	action = [selected, m]
	socket.emit("action", {
		action: action
	});
});

socket.on("board",function(data){
	board = data.board;
	$(".checker").remove();
	unhighlight();
	displayPieces();
});

socket.on("err",function(data){
	alert(data.message)
});

// rooms

var form = document.getElementById('room');
form.addEventListener('submit', function(e) {
	var input = document.getElementById('room-input')
	var value = input.value;
	socket.emit("joinRoom", {
	 	roomID: value
	})

	e.preventDefault();
})