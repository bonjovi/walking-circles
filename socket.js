var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/d3-stackoverflow.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

io.on('connection', function(socket){

  socket.on('moving', function(cx, cy){
  	console.log(cx, cy);
    io.emit('moving', cx, cy);
  });
});

// var data = {
// 		x: mouseX,
// 		y: mouseY
// 	}

// io.on('connection', function(socket){
//   socket.on('moving', function(msg){
//     io.emit('moving', data);
//   });
// });

http.listen(3000, function(){
  console.log('listening on *:3000');
});