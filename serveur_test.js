//serveur express


const express = require('express');
const socketIO = require('socket.io')
const fs = require('fs');
var path = require('path');
const readline = require('readline');
const db = require('sqlite3');



const host = 'localhost';
const port = 8000;
let clients = 0;

const app = express();

const server = app.listen(port, function(){
    console.log('listening for requests on port 8000');
});


app.use(express.static(path.join(__dirname, '/Othello')));
app.get('/',function(req,res){
   res.sendFile(path.join(__dirname + '/Othello/frame.html'));
});

/*
app.get('',function(req,es){
   res.send('qt')
});
*/

//sockets
const io= socketIO(server);

io.on('connection',function(socket){
   console.log('Utilisateur connecté');
   socket.join('test room');
   //socket.emit('ping','ping');
   socket.on('disconnect',function(socket){
      console.log('Utilisateur déconnecté');
   });

//enregistrement des joueurs
   socket.on('login', function(uname){
      console.log(uname+' s\'est connecté');
      var val = Math.floor(Math.random() * 10);
      socket.emit('token',{ auth: val });
   });



//chat
//quand un joueur pose un pion
   socket.on('play', function(coord){
      socket.to('test room').emit('playEm',coord);//envoie les données de jeu à l'autre joueur pour mettre à jour son plateau
   });

//quand un joueur envoie un message
   socket.on('chatMsg', function(msg){
      socket.to('test room').emit('chatEm',msg);//envoie le message au joueur
      console.log(msg);
   });
});


