//serveur express


const express = require('express');
const socketIO = require('socket.io')
const fs = require('fs');
var path = require('path');
const readline = require('readline');



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

//identification des joueurs

let users= {};


//%%%%%%%%%%%%%%%%%%%%%%%%% Sockets %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


const io=socketIO(server);


io.on('connection',function(socket){
//Connexion/déconnexion%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
   console.log('Utilisateur connecté');
   socket.on('disconnect',function(socket){
      console.log('Un utilisateur s\'est déconnecté');
   });

//Enregistrement des joueurs%%%%%%%%%%%%%%%
   socket.on('login', function(uname){
      socket.uname= uname;
      console.log(uname+' s\'est connecté au socket '+socket.id);
      console.log(users);
   });
//Rejoindre salon%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%   
   socket.on('join',function(room){
      socket.join(room);
      io.in(room).emit('chatEm','Bienvenue, '+socket.uname+', dans le salon '+room);
      socket.to(room).emit('chatEm','You are player black');
      console.log('Bienvenue, '+socket.uname+', dans le salon '+room);
      socket.to(room).emit("ping",1);
    });


//%%%%%%%%%%%%%%%%%%%%%%%%% Chat %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//quand un joueur envoie un message%%%%%%%%%%%%%
   socket.on('chatMsg', function(msg){
      playerName = socket.uname;
      console.log(playerName);
      room = Array.from(socket.rooms).filter(roomId => roomId!=socket.id)[0];
      console.log(room);
      socket.to(room).emit('chatEm',playerName+' : '+msg);//envoie le message au joueur dans le même salon
      console.log(playerName+' : '+msg);
   });
   

   socket.on('pong',function(){
      room = Array.from(socket.rooms).filter(roomId => roomId!=socket.id)[0];
      socket.to(room).emit('change-mode',-1);
      socket.to(room).emit('chatEm','You are player white');
      console.log("pong");
   });



//%%%%%%%%%%%%%%%%%%%%%%%%% Pose de pion %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//quand un joueur pose un pion
     socket.on('play', function(tab){
        room = Array.from(socket.rooms).filter(roomId => roomId!=socket.id)[0];
         socket.to(room).emit('playEm',tab);//envoie les données de jeu à l'autre joueur pour mettre à jour son plateau
         console.log(tab);
   });


   socket.on('skip', function(){
      room = Array.from(socket.rooms).filter(roomId => roomId!=socket.id)[0];
       socket.to(room).emit('skipEm', 'skip');
       console.log('skip');
 });


   socket.on('Victory', function(color){
      room = Array.from(socket.rooms).filter(roomId => roomId!=socket.id)[0];
      io.in(room).emit('big-announcement', color); // envoie le message de Victoire au chat
      console.log('win');
 });

   socket.on('finish', function(color){
      room = Array.from(socket.rooms).filter(roomId => roomId!=socket.id)[0];
      socket.to(room).emit('end', 'end'); //end game for everyone
      console.log('finish');
 });




});
