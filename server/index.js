import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://10.0.0.45:5173'
  }
});

server.listen(3000, '10.0.0.45', () => {
  console.log("server running at http://10.0.0.45:3000");
}); 

io.on('connection', (socket) => {
  console.log('someone connected')
  socket.on('disconnect', () => {
    console.log('disc')
  })
  socket.on('fire', (value) => {
    console.log(value)
  })
})