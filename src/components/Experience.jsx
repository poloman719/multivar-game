import { OrbitControls, Line } from "@react-three/drei";
import { Ship } from "./Ship";
import { useEffect } from "react";

export const Experience = ({ lines, ships, addShip, explodedShips }) => {

  useEffect(() => {
    console.log(lines)
  }, [lines])
  return (
    <>
      <OrbitControls />
      {/* {
        explosions.map(explosion => (<mesh position={explosion} scale={0.2}>
          <planeGeometry />
          <meshBasicMaterial attach='material' map={texture} transparent />
        </mesh>))
      } */}
      {lines.map(line => <Line 
        points={[[line[0][0],line[0][1],line[0][2]],[line[0][0] + line[1][0] * 10, line[0][1] + line[1][1] * 10, line[0][2] + line[1][2] * 10]]}
        segments
        color="red"
      />)}
      {ships?.map(ship => <Ship key={ship.id} data={ship} addShip={addShip} exploded={explodedShips?.includes(ship.id)}/>)}
    </>
  );
};
