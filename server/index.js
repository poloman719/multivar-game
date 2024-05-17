import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://172.16.5.4:5173'
  }
});

const users = [];
// structure: { name, id, health, position, velocity (not time, that is handled on server) }
const gameState = false;

server.listen(3000, () => {
  console.log("server running at http://10.0.0.45:3000");
}); 

io.on('connection', (socket) => {
  console.log('someone connected')
  socket.on('disconnect', () => {
    console.log('disc')
  })
  socket.emit('users', users);
  socket.on('new_user', (value) => {
    const newUser = { name: value, id: socket.id, health: 100, velocity: null }
    users += newUser;
    io.emit('new_user', newUser)
  })
  socket.on('fire', (value) => {
    console.log(value)
  })
})