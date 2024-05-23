import { OrbitControls, Line } from "@react-three/drei";
import { Ship } from "./Ship";
import { useEffect, useRef } from "react";
import useAnimation from "./useAnimation";
import Laser from "./Laser";
import { Quaternion, Vector3 } from "three";

export const Experience = ({ lines, ships, addShip, explodedShips, targetState, target, user }) => {
  // const explosionTexture = useAnimation("explosion-animation/explosion0", "png", 67, 1);
  // const laserTexture = useAnimation("laser-animation/laser0","png",139, 1);
  // const muzzleFlashTexture = useAnimation("muzzle_flash-animation/muzzle flash0", "png", 33, 3);
  const controls = useRef();

  useEffect(()=>{
    console.log("TARGET CHANGE")
    controls.current.update();
  }, [targetState])

  return (
    <>
      <OrbitControls targetState={targetState} target={target} ref={controls}/>
      {/* {
        explosions.map(explosion => (<mesh position={explosion} scale={0.2}>
          <planeGeometry />
          <meshBasicMaterial attach='material' map={texture} transparent />
        </mesh>))
      } */}
      {lines.map(line => <Laser 
        start={line[0]}
        end={line[0].map((n, i) => n + line[1][i] * 10)}
      />)}
      {/* <mesh scale={[1, 0.72737186477, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={muzzleFlashTexture} transparent/>
      </mesh> */}
      {/* <Laser start={[-3,0,0]} end={[3,0,0]}/> */}
      {ships?.map(ship => <Ship key={ship.id} data={ship} addShip={addShip} exploded={explodedShips?.includes(ship.id)} isYou={ship.id == user.id}/>)}
    </>
  );
};
