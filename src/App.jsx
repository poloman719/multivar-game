import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useState, createContext, useEffect } from "react";
import SideBar from "./components/SideBar";
import { Raycaster, TextureLoader } from "three";
import removeObject3D from "./components/remove";
import { useLoader } from "@react-three/fiber";
import { socket } from "./socket";

export const LineContext = createContext(null);
export const ShipContext = createContext(null);
export const UserContext = createContext(null);

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [line, setLine] = useState(null);
  const [ships, setShips] = useState([]);
  const [user, setUser] = useState("");
  const texture = useLoader(TextureLoader, "explosion.png");

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const LineCheck = (origin, direction, ships) => {
    const raycaster = new Raycaster(origin, direction.normalize(), 1);
    const intersections = raycaster.intersectObjects(ships, false);
    if (intersections.length == 0) return null;
    const obj = intersections[0].object;
    obj.material.map = texture;
    obj.scale.set(1, 1, 1);
    setTimeout(() => {
      obj.userData.health -= 10;
      console.log(obj.userData.health);
      setLine(null);
    }, 500);
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

  return (
    <>
      <div className='app'>
        <UserContext.Provider value={user}>
          <LineContext.Provider value={line}>
            <ShipContext.Provider value={addShip}>
              <SideBar fire={fire} move={move} setUser={setUser} />
              <Canvas shadows camera={{ position: [0, 0, 20], fov: 30 }}>
                <color attach='background' args={["#000000"]} />
                <Experience />
              </Canvas>
            </ShipContext.Provider>
          </LineContext.Provider>
        </UserContext.Provider>
      </div>
    </>
  );
}

export default App;
