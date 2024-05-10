import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useState, createContext } from "react";
import SideBar from "./components/SideBar";
import { Raycaster, TextureLoader } from "three";
import removeObject3D from "./components/remove";
import { useLoader } from "@react-three/fiber";

export const LineContext = createContext(null);
export const ShipContext = createContext(null);

function App() {
  const [line, setLine] = useState(null);
  const [ships, setShips] = useState([]);
  const texture = useLoader(TextureLoader, "explosion.png");

  const LineCheck = (origin, direction, ships) => {
    const raycaster = new Raycaster(origin, direction.normalize(), 1);
    const intersections = raycaster.intersectObjects(ships, false);
    intersections.forEach((intersection) => {
      const obj = intersection.object;
      obj.material.map = texture;
      obj.scale.set(1, 1, 1);
      setTimeout(() => {
        removeObject3D(obj);
        setLine(null);
      }, 500);
    });
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

  return (
    <>
      <div className='app'>
        <LineContext.Provider value={line}>
          <SideBar fire={fire} />
          <ShipContext.Provider value={addShip}>
            <Canvas shadows camera={{ position: [0, 0, 20], fov: 30 }}>
              <color attach='background' args={["#000000"]} />
              <Experience />
            </Canvas>
          </ShipContext.Provider>
        </LineContext.Provider>
      </div>
    </>
  );
}

export default App;
