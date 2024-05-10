import { OrbitControls, Line } from "@react-three/drei";
import { Ship } from "./Ship";
import { useContext, useRef } from "react";
import { LineContext, ShipContext } from "../App";

export const Experience = () => {
  const line = useContext(LineContext);
  const addShip = useContext(ShipContext);

  const positions = useRef(new Array(7).fill(0).map(() => {
    const x = Math.floor(Math.random() * 11) - 5;
    const y = Math.floor(Math.random() * 11) - 5;
    const z = Math.floor(Math.random() * 11) - 5;
    return [x, y, z]
  }));

  return (
    <>
      <OrbitControls />
      {line && <Line 
        points={[[line[0].x,line[0].y,line[0].z],[line[0].x + line[1].x * 10, line[0].y + line[1].y * 10, line[0].z + line[1].z * 10]]}
        segments
        color="red"
      />}
      {positions.current.map(position => <Ship position={position} name={"Joe"} addShip={addShip}/>)}
    </>
  );
};
