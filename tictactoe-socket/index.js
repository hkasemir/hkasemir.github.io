var express = require("express");
var app = express();
var http = require("http").Server(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var gameId = null;
  socket.on('create room', function(data){
    gameId = Math.random() * 1000000 | 0;
    socket.join(gameId);
    socket.emit('gameId', gameId);
  })
  
  socket.on('join room', function(data){
    gameId = data;
    var roomId = socket.adapter.rooms[data];
    if (roomId != undefined){
      socket.join(gameId);
      io.sockets.in(gameId).emit('message', 'Let the game begin!');
    }
  })
  
  socket.on('board size change', function(size){
    io.sockets.in(gameId).emit('change board', size);
  });
  
  socket.on('move', function(id){
    io.sockets.in(gameId).emit('update board', id)
  });
})

http.listen(port, function(){
  console.log('listening on :3000');
});

