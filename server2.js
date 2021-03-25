//initialisation des valeurs

const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const readline = require('readline');


var server;
var io;
const host = 'localhost';
const port = 8000;

//creation du serveur

server = http.createServer(function (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
      res.writeHead(200);
      res.end(data);
    }); //renvoie à l'index pour commencer l'interaction avec le serveur
});

server.listen(port);
console.log(`Server is running on http://${host}:${port}`);

//gestion joueurs

var users = new Array();
var unames = new Array();
var splitline;

const readInterface = readline.createInterface({
    input: fs.createReadStream('./users.txt'),
    //output: process.stdout,
    //console: false
});

readInterface.on('line', function(line) {
    splitline = line.split(';');
    users.push(splitline[0]);
    unames.push(splitline[1]);
    //console.log(users);
    //console.log(unames);
});




//gestion des sockets
io = socketIO(server);



/*io.on('connection', function (socket) {
  socket.emit('greeting-from-server', {
      greeting: 'Hello Client'
  });
  socket.on('greeting-from-client', function (message) {
    console.log(message);
  });
});*/

//sockets pour le log-in du client
io.on('connection', function (socket) {
   socket.emit('log-disp', {
   validation : 'User'
   });
});

/*io.on('submit-name', function (socket) {
  console.log(socket.id);
  socket.emit('log', {
  validation : (socket.id in users) ? 'Identified user':'New user'
  });// si l'id du socket est inconnu : nouveau client => choix de nom d'utilisateur, sinon jeu
});*/

//functions

/*function newUser(ID){
  if ()
}
*/
