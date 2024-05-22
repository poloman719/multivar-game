import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useState, createContext, useEffect } from "react";
import SideBar from "./components/SideBar";
import Lobby from "./components/Lobby";
import { Raycaster, TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import { socket } from "./socket";
import { Vector3 } from "three";
import QuestionPrompt from "./components/QuestionPrompt";

export const LineContext = createContext(null);

function App() {
  const [lines, setLines] = useState([]);
  const [ships, setShips] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState(false);
  const [explodedShips, setExplodedShips] = useState([]);
  const [question, setQuestion] = useState(null);
  const [mode, setMode] = useState(null);
  const [answering, setAnswering] = useState(true);
  
  useEffect(() => {
    socket.on("session", ({ sessionID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
    });

    socket.on("users", (value, callback) => {
      setUsers(value);
      callback({
        status:"recieved"
      });
      console.log("sending callback");  
    });
    socket.on("new_user", (value) => {
      console.log("NEW USER")
      setUsers((state) => [...state, value]);
      if (value.id == localStorage.getItem("sessionID")) setUser(value);
    });
    socket.on("recieve_existing_user",(value, gameState)=>{
      console.log("USER_RECONNECTED");
      if (value.id == localStorage.getItem("sessionID")) setUser(value);
      setGameState(gameState);
    })
    socket.on("start_game", (positions) => {
      setUsers((users) => {
        users.forEach((user, i) => {
          user.position = positions[i];
        });
        setGameState(true);
        return users;
      });
    });
    socket.on("end_game", (winner) => {
      if(winner=="bruh"){
      console.log("host killed the game because they stink");
      let maxHits = 0;
        for(const user of users){
          if(user.hits>maxHits)
            maxHits = user.hits;
        }
      const usersWithMaxHits = users.filter((user)=>user.hits==maxHits);
      let definitiveWinner = null;
      let definitiveWinners = usersWithMaxHits;
      if(usersWithMaxHits.length>1) {
        let highestHealth = 0;
        for(const user of usersWithMaxHits){
          if(user.health>highestHealth) highestHealth=user.health;
        }
        const usersWithHighestHealth = users.filter((user)=>user.health==highestHealth);
        if(usersWithHighestHealth.length==1)
          definitiveWinner=usersWithHighestHealth[0];
        else definitiveWinners = usersWithHighestHealth;
      }
      else definitiveWinner=usersWithMaxHits[0];
      if(definitiveWinner)
        alert(`${definitiveWinner.name} has won!`);
      else {
        let str = "The following people have tied for 1st place: ";
        for(winner of definitiveWinners){
          str+=winner+", ";
        }
        str = str.substring(0,str.length-2);
        alert(str);
      }
      console.log(mode);
    }
      else {
        console.log(winner.name+" has won!");
      }
      setTimeout(() => {
        setGameState(false);
        setUsers([]);
        setUser(null);
      }, 5000);
      // setUsers([]);
    });
    socket.on("move", (id, vel) => {
      setUsers(state => state.map(user => user.id == id ? {...user, velocity: vel} : user))
    });
    socket.on("stop", (id, position) => {
      setUsers(state => state.map(user => user.id == id ? {...user, velocity: 0, position: position} : user))
    });
    socket.on("damage", (id, hitterID) => {
      console.log(`player with id of ${id} hit!`);
      setUsers(state => state.map(user => user.id == id ? {...user, health: user.health - 10} : user));
      setUsers(state => state.map(user => user.id == hitterID ? {...user, hits: user.hits+1} : user));
    });
    socket.on('fire', (userFiring, line) => {
      console.log("recieved fire!!!");
      const newLine = [userFiring.position,line];
      const filteredShips = ships.filter(a=> a!=userFiring);
      console.log(filteredShips);
      LineCheck(userFiring.position, line, filteredShips);
      setLines((lines)=>[
        ...lines,newLine
      ]);
      setTimeout(()=>{
        setLines(lines=>lines.filter(a=> a!=newLine));
      },4000);
      console.log(lines);
    });
    socket.on("kill",(id,killerID)=>{
      kill(id,killerID);
    })
    socket.on('question', (question) => {
      setQuestion(question);
      console.log("banana")
    })
  }, []);

  const LineCheck = (origin, direction, ships) => {
    origin = new Vector3(origin[0], origin[1], origin[2]);
    direction = new Vector3(direction[0], direction[1], direction[2]);
    const raycaster = new Raycaster(origin, direction.normalize(), 1);
    const intersections = raycaster.intersectObjects(ships, false);
    if (intersections.length == 0) return null;
    const obj = intersections[0].object;
    obj.scale.set(1, 1, 1);
    const id = obj.userData.id;
    console.log("emitting damage to id: "+id);
    socket.emit("damage", id);
    return intersections[0].point;
  };

  const addShip = (ship) => {
    setShips((ships) => {
      ships.push(ship);
      return ships;
    });
  };

  const kill = (id, killerID, killedName, killerName) => {
    alert(`${killedName} has been blown up by ${killerName}!`);
    // console.log(id+" dieded lmao");
    setExplodedShips(state => [...state, id]);
    setTimeout(() => {
      setExplodedShips(state => state.filter(ship => ship.id != id))
      setUsers(state => state.filter(user => user.id != id))
    }, 3000)
    // const killedShip = ships.find((ship) => user.id == id);

    // change texture of killed to explosion and set timeout to delete explosion
  };

  const escapePrompt = () => {
    setQuestion(null);
  }

  console.log(mode);
  
  return (
    <>
      {(gameState)?
      <div className='app'>
        <LineContext.Provider value={lines}>
          {users!=null? <SideBar
            users={users}
            loggedIn={user}
            isHost={user?.host}
            gameState={gameState}
            answering={answering}
            setAnswering={setAnswering}
          /> : <h1>Loading...</h1>}
          {question && <QuestionPrompt users={users} question={question} markCorrect={escapePrompt} setAnswering={setAnswering} answering={answering}/>}
          <Canvas shadows camera={{ position: [0, 0, 20], fov: 30 }}>
            <color attach='background' args={["#000000"]} />
            {gameState && (
              <Experience ships={users} lines={lines} addShip={addShip} explodedShips={explodedShips}/>
            )}
          </Canvas>
        </LineContext.Provider>
      </div>
      : <Lobby users={users} user={user} isHost={user?.host} gameState={gameState}/>}
    </>
  );
}

export default App;
