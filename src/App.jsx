import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useState, createContext, useEffect, useRef } from "react";
import SideBar from "./components/SideBar";
import Lobby from "./components/Lobby";
import { Raycaster, TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import { socket } from "./socket";
import { Vector3 } from "three";
import QuestionPrompt from "./components/QuestionPrompt";
import Laser from "./components/Laser";
import hitWarning from "./assets/youve_been_hit.gif";

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
  const [messageBoard, setMessageBoard] = useState([]);
  const [justHit, setJustHit] = useState(false);
  const userRef = useRef(user);
  const usersRef = useRef(users);
  const [target, setTarget] = useState([0,0,0]);
  const[targetState,setTargetState] = useState(false);
  
  useEffect(() => { userRef.current = user });
  useEffect(() => { usersRef.current = users });

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
        status: "recieved",
      });
      console.log("sending callback");
    });
    socket.on("new_user", (value) => {
      console.log("NEW USER");
      setUsers((state) => [...state, value]);
      if (value.id == localStorage.getItem("sessionID")) setUser(value);
    });
    socket.on("recieve_existing_user", (value, gameState) => {
      console.log("USER_RECONNECTED");
      if (value.id == localStorage.getItem("sessionID")) setUser(value);
      setGameState(gameState);
    });
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
      console.log(winner);
      if (winner == "bruh" || winner=="null") {
        updateBoard("The host has ended the game.");
        // console.log("host killed the game because they stink");
        let maxHits = 0;
        for (const user of usersRef.current) {
          if (user.hits > maxHits) maxHits = user.hits;
        }
        const usersWithMaxHits = users.filter((user) => user.hits == maxHits);
        let definitiveWinner = null;
        let definitiveWinners = usersWithMaxHits;
        if (usersWithMaxHits.length > 1) {
          let highestHealth = 0;
          for (const user of usersWithMaxHits) {
            if (user.health > highestHealth) highestHealth = user.health;
          }
          const usersWithHighestHealth = users.filter(
            (user) => user.health == highestHealth
          );
          if (usersWithHighestHealth.length == 1)
            definitiveWinner = usersWithHighestHealth[0];
          else definitiveWinners = usersWithHighestHealth;
        } else definitiveWinner = usersWithMaxHits[0];
        // if(definitiveWinner)
        //   // alert(`${definitiveWinner.name} has won!`);
        // else {
        //   let str = "The following people have tied for 1st place: ";
        //   for(winner of definitiveWinners){
        //     str+=winner+", ";
        //   }
        //   str = str.substring(0,str.length-2);
        //   // alert(str);
        // }
        console.log(mode);
      } else {
        updateBoard(`${winner.name} has won!`);
        // console.log(winner.name+" has won!");
      }
      setTimeout(() => {
        setGameState(false);
        setUsers([]);
        setUser(null);
        setExplodedShips([]);
      }, 5000);
      // setUsers([]);
    });
    socket.on("move", (id, vel, rot) => {
      setUsers((state) =>
        state.map((user) => (user.id == id ? { ...user, velocity: vel, rotation: rot } : user))
      );
    });
    socket.on("stop", (id, position) => {
      setUsers((state) =>
        state.map((user) =>
          user.id == id ? { ...user, velocity: 0, position: position } : user
        )
      );
    });
    socket.on("damage", (id, hitterID) => {
      console.log(userRef.current.id==id);
      damage(id, hitterID);
      setUsers((state) =>
        state.map((user) =>
          user.id == id ? { ...user, health: user.health - 10 } : user
        )
      );
      setUsers((state) =>
        state.map((user) =>
          user.id == hitterID ? { ...user, hits: user.hits + 1 } : user
        )
      );
    });
    socket.on("fire", (userFiring, line, rot) => {
      console.log("recieved fire!!!");
      const newLine = [userFiring.position, line];
      const filteredShips = ships.filter((a) => a != userFiring);
      console.log(filteredShips);
      setUsers((state) =>
        state.map((user) => (user.id == userFiring.id ? { ...user, rotation: rot } : user))
      );
      if (userRef.current.id == userFiring.id) LineCheck(userFiring.position, line, filteredShips);
      setLines((lines) => [...lines, newLine]);
      setTimeout(() => {
        setLines((lines) => lines.filter((a) => a != newLine));
      }, 4000);
      console.log(lines);
    });
    socket.on("kill", (id, killerID, killedName, killerName) => {
      kill(id, killerID, killedName, killerName);
    });
    socket.on("question", (question) => {
      setQuestion(question);
      console.log("banana");
    });
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
    console.log("emitting damage to id: " + id);
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
    updateBoard(`${killedName} has been blown up by ${killerName}!`);
    // console.log(`${killedName} has been blown up by ${killerName}!`);
    console.log(id + " dieded lmao");
    setExplodedShips((state) => [...state, id]);
    setTimeout(() => {
      setExplodedShips((state) => state.filter((ship) => ship.id != id));
      setUsers((state) => state.filter((user) => user.id != id));
    }, 3000);
    // const killedShip = ships.find((ship) => user.id == id);

    // change texture of killed to explosion and set timeout to delete explosion
  };

  const escapePrompt = () => {
    setQuestion(null);
  };

  const updateBoard = (message) => {
    setMessageBoard((array) => {
      array.push(message);
      return array;
    });
    setTimeout(() => {
      setMessageBoard(
        messageBoard.filter((m) => {
          m == message;
        })
      );
    }, 5000);
  };

  const damage = (id, hitterID) => {
    console.log(`player with id of ${id} hit!`);
    console.log(user);
    // console.log(user.id==id);
    // console.log(socket.sessionID)
    if (userRef.current.id == id) {
      setJustHit(true);
      updateBoard("Your remaining health: " + (userRef.current.health - 10));
      setTimeout(() => {
        setJustHit(false);
      }, 9400);
    }
  };

  const targetHandler = ()=> {
    console.log("targetHandler called in app");
    setTarget(userRef.current.position);
    console.log(userRef.current.position);
    console.log(target);
    setTargetState(!targetState);
  }
    console.log(mode);
    console.log(user);

    return (
      <>
        {(gameState && user) ? (
          <div className='app'>
            <LineContext.Provider value={lines}>
              {users != null ? (
                <SideBar
                  users={users}
                  loggedIn={user}
                  isHost={user?.host}
                  gameState={gameState}
                  answering={answering}
                  setAnswering={setAnswering}
                  targetHandler={targetHandler}
                />
              ) : (
                <h1>Loading...</h1>
              )}
              {question && (
                <QuestionPrompt
                  users={users}
                  question={question}
                  markCorrect={escapePrompt}
                  setAnswering={setAnswering}
                  answering={answering}
                />
              )}
              <div className='messageBoard'>
                {messageBoard.map((message) => (
                  <p>{message}</p>
                ))}
              </div>
              {justHit && (
                <div id='warning-div'>
                  <img id='warning' src={hitWarning} />
                </div>
              )}
              <Canvas shadows camera={{ position: [0, 0, 20], fov: 30 }}>
                <color attach='background' args={["#000000"]} />
                {(gameState&&user&&userRef.current) && (
                  <Experience
                    ships={users}
                    lines={lines}
                    addShip={addShip}
                    explodedShips={explodedShips}
                    user={user}
                    targetState={userRef.current.position}
                    target={target}
                  />
                )}
              </Canvas>
            </LineContext.Provider>
          </div>
        ) : (
          <Lobby
            users={users}
            user={user}
            isHost={user?.host}
            gameState={gameState}
          />
        )}
      </>
    );
};
export default App;
