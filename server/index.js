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

const questions = [
  { number: 1, question: "Find the linear equation of the plane that passes through (6, 2, 4)  and is parallel to the plane 4x - 6y + 3z -7 = 0.", answer: {a:12,b:-18,c:9,d:-72}, type: "plane"},
  { number: 2, question: "Determine whether the planes 2x - 5y + 3z = 45 and 25y + 225 = 15z + 10x are parallel, perpendicular, or neither. If neither, find the angle between the two planes, and round to the nearest thousandth in radians.", answer: "parallel"},
  { number: 3, question: "Determine whether the planes 8x -2z + y =17 and 32z + 2y = 12x + 7  are parallel, perpendicular, or neither. If neither, find the angle between the two planes, and round to the nearest thousandth in radians.", answer:"2.160"},
  { number: 4, question: "Determine whether the planes 9x - 15y - 6z = 31 and -4x + 2y - 11z = -56  are parallel, perpendicular, or neither. If neither, find the angle between the two planes, and round to the nearest thousandth in radians.", answer: "perpendicular"},
  { number: 5, question: "Find the distance from the point (13, 6, 2) to the plane 7z - 2y + 4x = 15. Round to the nearest thousandth.", answer: "4.695"},
  { number: 6, question: "Find the distance from the point (7, 5, 6) to the plane 9x + 2z -2y = 5. Round to the nearest thousandth.", answer: "6.418"},
  { number: 7, question: "Determine whether the lines are parallel, skew, or intersecting. If they intersect, find the point of intersection: x = -6t, y = 1 + 9t, z = -3t 	| x = 1 + 2s, y = 4 - 3s, z = s", answer: "parallel"},
  { number: 8, question: "Find the equation of the plane that passes through the point (1, -1, 1) and with normal vector i + j - k.", answer: {a:1,b:1,c:-1,d:1}, type: "plane"},
  { number: 9, question: "Determine whether the planes x + 4y - 3z = 1 and -3x + 6y + 7z = 0 are parallel, perpendicular, or neither. If neither, find the angle between the two planes in radians. For neither, round to the nearest thousandth.", answer: "perpendicular"},
  { number: 10, question: "Find the distance from the point (-6, 3, 5) to the plane x - 2y - 4z = 8. Round to the nearest thousandth.", answer: "8.729"},
  { number: 11, question: "Find the angle between the planes x + y + z = 1 and x + 2y + 2z = 1 in radians. Round to the nearest thousandth.", answer: "0.276"},
  { number: 12, question: "Determine whether the line that passes through (-4, -6, 1) and (-2, 0, -3) and the line through (10, 18, 4) and (5, 3, 14) are parallel, perpendicular, or neither.", answer: "parallel"},
  { number: 13, question: "Find the point at which the line x = 3 - t, y = 2 + t, z = 5t intersects the plane x - y + 2z = 9.", answer: {a:2,b:3,c:5}, type: "point"},
  { number: 14, question: "Find the direction numbers for the line of intersection of the planes x + y + z = 1 and x + z = 0.", answer: {a:1,b:0,c:-1}, type: "point"},
  { number: 15, question: "Find the linear equation of the plane that has a normal vector <8, 1, 2> and contains the point(-1, 2, -5).", answer: {a:8,b:1,c:2,d:16}, type: "plane"},
  { number: 16, question: "What is the angle of intersection of the two planes: 3x+15y-7z+10=0, -6x-30y+14z-15=0? If the planes are parallel, enter “parallel”.", answer: "parallel"},
  { number: 17, question: "What is the distance between the plane x+3y+5z+13=0 and the point (1,2,3)? Round your answer to the nearest thousandth.", answer: "5.916"},
  { number: 18, question: "What is the angle between the planes 15x+15y+15z+15=15 and 16x+16y+16z+16=16 in radians?", answer: "0"},
  { number: 19, question: "Are the lines (x+6)/9=(y+32)/3=(z-33)/15 and (x-2)/6=(y+4)/2=(z-6)/10 intersecting, parallel, or skew?", answer: "parallel"},
  { number: 20, question: "Find the point of intersection of the lines x+6=y+3=z-5 and 2x+10=3y+4=2z-16.", answer: {a:-4,b:-1,c:7}, type: "point"},
  { number: 21, question: "Find the linear equation of the plane that has a normal vector <1,2,3> and contains the point (3,2,1)", answer: {a:1,b:2,c:3,d:-10}, type: "plane"},

]

class User {
  constructor(n, i, h = false) {
    this.name = n;
    this.id = i;
    this.health = 30;
    this.position = null;
    this.velocity = null;
    this.host = h;
    this.hits = 0;
    this.gotQuestions = [];
  }

  damage(hitterID) {
    this.health -= 10;
    io.emit("damage", this.id, hitterID);
    if (this.health <= 0) {
      kill(this.id, hitterID);
    }
    const hitter = users.find((user)=>{
      return user.id==hitterID
    });
    hitter.hits = hitter.hits + 1;
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
const kill = (id, killerID) => {
  const killed = users.find((user) => user.id == id)
  const killer = users.find((user) => user.id == killerID)
  io.emit("kill", id, killerID, killed.name, killer.name);
  const remaining = users.filter((user) => user.id != id);
  users = remaining;
  if (remaining.length == 1) {
    endGame(remaining[0]);
  }
}
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
    const hitterId = socket.sessionID;
    if(damaged)
      damaged.damage(hitterId);
  });
  socket.on("kill",(id)=>{
    console.log(socket.sessionID)
    kill(id, socket.sessionID);
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
  });
  socket.on("get_question", () => {
    const user = users.find((user) => user.id == socket.sessionID)
    let remainingQuestions = questions.filter(question => !user.gotQuestions.includes(question.number));
    if (remainingQuestions == 0) {
      remainingQuestions = questions;
    }
    const rand = Math.floor(Math.random() * (remainingQuestions.length) );
    const question = remainingQuestions[rand];
    user.gotQuestions.push(question.number);
    socket.emit("question", question);
  })
});
