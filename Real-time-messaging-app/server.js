const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (username) => {
    users[socket.id] = username;
    io.emit('userJoined', username);
  });

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', {
      username: users[socket.id],
      message: message,
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    io.emit('userLeft', users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
