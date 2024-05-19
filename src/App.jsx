import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useState, createContext, useEffect } from "react";
import SideBar from "./components/SideBar";
import Lobby from "./components/Lobby";
import { Raycaster, TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import { socket } from "./socket";

export const LineContext = createContext(null);

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [line, setLine] = useState(null);
  const [ships, setShips] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState(false);
  const texture = useLoader(TextureLoader, "explosion.png");
  
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    
    socket.on("session", ({ sessionID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
    });

    socket.on("users", (value) => {
      setUsers(value);  
    });
    socket.on("new_user", (value) => {
      setUsers((state) => [...state, value]);
      if (value.id == localStorage.getItem("sessionID")) setUser(value);
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
    socket.on("kill", (value) => {
      // change texture of killed to explosion and set timeout to delete explosion
    });
    socket.on("end_game", () => {
      setUsers([]);
      setGameState(false);
    });
    socket.on("move", (id, vel) => {
      const moved = users.find((user) => user.id == id);
      moved.velocity = vel;
    });
    socket.on("stop", (id, position) => {
      const stopped = users.find((user) => user.id == id);
      stopped.velocity = null;
      stopped.position = position;
    });
    socket.on("damage", (id) => {
      const damaged = users.find((user) => user.id == id);
      damaged.health -= 10;
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const LineCheck = (origin, direction, ships) => {
    const raycaster = new Raycaster(origin, direction.normalize(), 1);
    const intersections = raycaster.intersectObjects(ships, false);
    if (intersections.length == 0) return null;
    const obj = intersections[0].object;
    obj.material.map = texture;
    obj.scale.set(1, 1, 1);
    const id = object.userData.id;
    socket.emit("damage", id);
    return intersections[0].point;
  };

  const addShip = (ship) => {
    setShips((ships) => {
      ships.push(ship);
      return ships;
    });
  };

  const fire = (val) => {
    setLine(val);
    LineCheck(val[0], val[1], ships);
  };

  const move = (val) => {
    console.log(val);
  };
  let isThereUser = false;
  for(const pieceofshituser of users){
    if(pieceofshituser.id==localStorage.getItem("sessionID"))
      isThereUser = true;
  }
  console.log(user);
  return (
    <>
      {(isConnected&&isThereUser)?
      <div className='app'>
        
        <LineContext.Provider value={line}>
          {users.length>0? <SideBar
            fire={fire}
            move={move}
            TEMPORARY={users}
            loggedIn={user}
            isHost={user?.host}
          /> : <h1>Loading...</h1>}
          <Canvas shadows camera={{ position: [0, 0, 20], fov: 30 }}>
            <color attach='background' args={["#000000"]} />
            {gameState && (
              <Experience ships={users} line={line} addShip={addShip} />
            )}
          </Canvas>
        </LineContext.Provider>
      </div>
      : <Lobby/>}
    </>
  );
}

export default App;
