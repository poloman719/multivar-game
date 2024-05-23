import { OrbitControls, Line } from "@react-three/drei";
import { Ship } from "./Ship";
import { useEffect, useRef } from "react";
import useAnimation from "./useAnimation";
import Laser from "./Laser";
import { Quaternion, Vector3 } from "three";

export const Experience = ({ lines, ships, addShip, explodedShips, target }) => {
  const explosionTexture = useAnimation("explosion-animation/explosion0", "png", 67, 1);
  const laserTexture = useAnimation("laser-animation/laser0","png",139, 1);
  const muzzleFlashTexture = useAnimation("muzzle_flash-animation/muzzle flash0", "png", 33, 3);
  
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
      {/* <mesh scale={[1, 0.72737186477, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={muzzleFlashTexture} transparent/>
      </mesh> */}
      <Laser start={[-1,0,0]} end={[1,2,0]}/>
      {ships?.map(ship => <Ship key={ship.id} data={ship} addShip={addShip} exploded={explodedShips?.includes(ship.id)}/>)}
    </>
  );
};
