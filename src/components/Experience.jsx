import { OrbitControls, Line } from "@react-three/drei";
import { Ship } from "./Ship";
import { useContext, useState } from "react";
import { Raycaster } from "three";
import { LineContext } from "../App";

export const Experience = () => {
  const line = useContext(LineContext);
  const [ships, setShips] = useState([]);

  const addShip = (ship) => {
    setShips(ships => {
      ships.push(ship);
      return ships;
    });
  }

  const [positions, setPositions] = useState(new Array(7).fill(0).map(() => {
    const x = Math.floor(Math.random() * 11) - 5;
    const y = Math.floor(Math.random() * 11) - 5;
    const z = Math.floor(Math.random() * 11) - 5;
    return [x, y, z]
  }));

  const LineCheck = (origin, direction, ships) => {
    const raycaster = new Raycaster(origin, direction.normalize(), 1);
    const intersections = raycaster.intersectObjects(ships, false);
    for (intersection of intersections) {
        const obj = intersection.object;
        alert(obj.name);
    }
}

  const deleteME = () => {
    LineCheck(line[0], line[1], ships);
    alert(line[0].x, line[0].y, line[0].z)
    alert("hehe")
  }

  return (
    <>
      <OrbitControls />
      {line && <Line 
        points={[[line[0].x,line[0].z,line[0].y],[line[0].x + line[1].x * 10, line[0].z + line[1].z * 10, line[0].y + line[1].y * 10]]}
        segments
        color="red"
      />}
      {positions.map(position => <Ship position={position} name={"Joe"} addShip={addShip}/>)}
      <mesh scale={.2} onClick={() => LineCheck(line[0], line[1], ships)}>
        <sphereGeometry/>
      </mesh>
    </>
  );
};
