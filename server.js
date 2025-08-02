const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users = new Set(); // Track online usernames

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('login', (username) => {
    if (users.has(username)) {
      socket.emit('login error', 'Username already taken');
      return;
    }

    socket.username = username;
    users.add(username);

    io.emit('user list', Array.from(users));
    io.emit('chat message', {
      user: 'Server',
      text: `${username} has joined the chat.`,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      users.delete(socket.username);
      io.emit('user list', Array.from(users));
      io.emit('chat message', {
        user: 'Server',
        text: `${socket.username} has left the chat.`,
        time: new Date().toLocaleTimeString()
      });
    }
    console.log('A user disconnected');
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
