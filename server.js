const allowedUsers = {
  "Shrawil": "shrawilsri8381",
  "Akriti": "akritithedon",
  "Tiya": "tiyaistia",
  "Amardeep Singh": "baapji",
  "Seema Srivastava": "seema102",
  "Indra": "sigmaindra",
  "Diva": "1210diva",
  "Adarsh": "5footdon",
  "Raj": "dacsahab",
};

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(bodyParser.json());

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (allowedUsers[username] === password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Serve public folder
app.use(express.static('public'));

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
