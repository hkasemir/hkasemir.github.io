
function init(){
  var socket = io();
  var gameArea = document.getElementById('game_area');
  var initialScreen = document.getElementById('initial_screen').innerHTML;
  gameArea.innerHTML = initialScreen;

  var startButton = document.getElementById('start_button');
  startButton.addEventListener('click', function(){
    socket.emit('create room');
  })
  
  socket.on('gameId', function(data){
    var gameScreen = document.getElementById('game_screen').innerHTML;
    gameArea.innerHTML = gameScreen;
    var gameIdHeader = document.getElementById('game_id');
    gameIdHeader.textContent = data;
  });
  
  var joinButton = document.getElementById('join_game_button');
  
  joinButton.addEventListener('click', function(){
    var joinGameId = document.getElementById('join_game_in').value;
    socket.emit('join room', joinGameId)
  })
  
  socket.on('message', function(message){
    var gameScreen = document.getElementById('game_screen').innerHTML;
    gameArea.innerHTML = gameScreen;
    var opponent = document.getElementById('opponent');
    opponent.textContent = message;
    var gameIdHeader = document.getElementById('game_id');
    
    createGame();
    
    var boxes = document.getElementsByClassName('col');
    for (var i = 0; i < boxes.length; i++){
      boxes[i].addEventListener('click', socketEmit);
    };

    var boardSizeSelector = document.getElementById("boardsize");
    boardSizeSelector.addEventListener('change', function(){
      socket.emit('board size change', this);
    });
  });
  
  function socketEmit(event){
    socket.emit('move', event.target.id)
  }
  
  socket.on('change board', function(size){
    document.getElementById("boardsize").selectedIndex = size.selectedIndex;
    refreshBoard(size.value);
    var boxes = document.getElementsByClassName('col');
    for (var i = 0; i < boxes.length; i++){
      boxes[i].addEventListener('click', socketEmit);
    };
  });
  
  
  socket.on('update board', function(id){
    makeMove(id)
//    clickToBoard(id);
//    document.getElementById(id).removeEventListener('click', socketEmit);
  });
  

}

window.addEventListener('load', init);
window.addEventListener('beforeunload', function(){
  socket.close();
});