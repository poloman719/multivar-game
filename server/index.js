import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { Vector3 } from "three";
import crypto from "crypto";
import InMemorySessionStore from "./SessionStore.js";

const app = express();
const server = createServer(app);
const sessionStore = new InMemorySessionStore();
const randomId = () => crypto.randomBytes(8).toString("hex");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  connectionStateRecovery:{
    maxDisconnectionDuration:2*60*1000,
  }
});

class User {
  constructor(n, i, h = false) {
    this.name = n;
    this.id = i;
    this.health = 100;
    this.position = null;
    this.velocity = null;
    this.host = h;
  }

  damage() {
    this.health -= 10;
    io.emit("damage", this.id);
    if (this.health <= 0) {
      const remaining = users.filter((user) => user.health > 0);
      if (remaining.length == 1) {
        gameState = false;
        users = [];
        io.emit("end_game", remaining[0].id);
      } else {
        io.emit("kill", this.id);
      }
    }
  }

  move(vel) {
    this.velocity = vel;
    io.emit("move", this.id, vel);
    setTimeout(() => {
      this.velocity = null;
      this.position = position.map((val, i) => val + velocity[i] * 5);
      io.emit("stop", this.id, this.position);
    }, 5000);
    // stops the movement after 5 seconds
  }
}

const users = [];
// structure: { name, id, health, position, velocity (not time, that is handled on server) }
let gameState = false;


server.listen(3000, () => {
  console.log("server running at http://10.0.0.54:3000");
});

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  console.log("sessionID: "+sessionID);
    // find existing session
    const session = sessionStore.findSession(sessionID);
    console.log(sessionStore);
    console.log("session: "+session);
    if(session){
    socket.sessionID = sessionID;
    return next();
    }
  
  // create new session
  socket.sessionID = randomId();
  sessionStore.saveSession(socket.sessionID,{
    connected: true,
  });
  next();
});

io.on("connection", (socket) => {
  console.log("someone connected with a session id of: "+socket.sessionID);
  sessionStore.saveSession(socket.sessionID,{
    connected: true,
  });
  socket.emit("session", {
    sessionID: socket.sessionID,
  });
  socket.on("disconnect", () => {
    console.log("disc");
    sessionStore.saveSession(socket.sessionID,{
      connected: false,
    });
  });
  if (users.length > 0) {
      console.log(users[0]);
      function sendUsers(){
        io.timeout(1000).emit("users", users, (res) =>{if(res) sendUsers()});
        console.log("sending...");
      }
      sendUsers();
  }
  socket.on("add_user", (value) => {
    const newUser = new User(value, socket.sessionID, users.length == 0);
    users.push(newUser);
    io.sockets.emit("new_user", newUser);
  });
  socket.on("start_game", () => {
    console.log("game started");
    gameState = true;
    const positions = users.map(() => {
      const x = Math.floor(Math.random() * 11) - 5;
      const y = Math.floor(Math.random() * 11) - 5;
      const z = Math.floor(Math.random() * 11) - 5;
      return [x, y, z];
    });
    users.forEach((user, i) => {
      user.position = positions[i];
    });
    io.emit("start_game", positions);
  });
  socket.on("damage", (id) => {
    const damaged = users.find((user) => user.id == id);
    damaged.damage();
  });
  socket.on("move", (vel) => {
    const moved = users.find((user) => user.id == socket.id);
    moved.move(vel);
  });
});
