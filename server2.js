var http = require('http'),
    socketIO = require('socket.io'),
    fs = require('fs'),
    server,
    io;

const host = 'localhost';
const port = 8000;

server = http.createServer(function (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
      res.writeHead(200);
      res.end(data);
    });
});

server.listen(port);
console.log(`Server is running on http://${host}:${port}`);

io = socketIO(server);

io.on('connection', function (socket) {
  socket.emit('greeting-from-server', {
      greeting: 'Hello Client'
  });
  socket.on('greeting-from-client', function (message) {
    console.log(message);
  });
});
