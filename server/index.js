import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
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
      io.emit("kill", this.id);
      users = remaining;
      console.log(remaining);
      if (remaining.length == 1) {
        endGame(remaining[0]);
      }
    }
  }

  move(vel) {
    this.velocity = vel;
    io.emit("move", this.id, vel);
    setTimeout(() => {
      this.position = this.position.map((val, i) => val + this.velocity[i] * 5);
      this.velocity = null;
      io.emit("stop", this.id, this.position);
    }, 5000);
    // stops the movement after 5 seconds
  }
  
}
const endGame = remaining =>{
  io.emit("end_game", remaining);
        setTimeout(()=>{
          gameState = false;
          users = [];
        },5000);
}; 

var users = [];
// structure: { name, id, health, position, velocity (not time, that is handled on server) }
let gameState = false;


server.listen(3000, () => {
  console.log("server running at idk");
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
    sessionStore.saveSession(socket.sessionID,{
      connected: true,
    });
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
  //if game already started, blocks person from joining
  if(gameState==true){
    socket.emit("late",()=>{console.log(socket.id+" was late to the game rip bozo")});
  }
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
        socket.emit("users", users, (res) =>{
          if(res==null||res.status!="recieved") {
            console.log("failed");
            sendUsers();
          }
        });
        console.log(`sending to ${socket.sessionID}...`);
      }
      sendUsers();
  }
  socket.on("add_user", (value) => {
    if(!gameState){
    const newUser = new User(value, socket.sessionID, users.length == 0);
    users.push(newUser);
    io.sockets.emit("new_user", newUser);
    }
    else
    socket.emit("late",()=>{console.log(socket.id+" was late to the game rip bozo")});
  });
  socket.on("recover_user", ()=>{
    for(const user of users){
      if(user.id==socket.sessionID);
      io.sockets.emit("recieve_existing_user", user, gameState);
    }  
  });
  socket.on("start_game", (callback) => {
    if(users.length<=1){
      console.log("not enough players");
      callback({
        status:"rejected"
      });
    }
    else{
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
    }
  });
  socket.on("end_game",()=>{
    endGame("bruh");
  })
  socket.on("damage", (id) => {
    const damaged = users.find((user) => user.id == id);
    if(damaged)
      damaged.damage();
  });
  socket.on("move", (vel) => {
    const moved = users.find((user) => user.id == socket.sessionID);
    console.log("moving: "+moved);
    if(moved!=null)
      moved.move(vel);
  });
  socket.on("fire",(line)=>{
    const userFiring = users.find((user)=>user.id==socket.sessionID);
    if(userFiring){
    const position = userFiring.position;
    console.log(position[0], position[1], position[2])
    io.emit("fire",userFiring,line);
    }
  }
)
});
