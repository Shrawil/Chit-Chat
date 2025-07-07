const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve files from "public" folder
app.use(express.static('public'));

// Socket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msgObj) => {
    io.emit('chat message', msgObj);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

