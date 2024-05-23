import { Euler, Vector3 } from "three"
import useAnimation from "./useAnimation"
import { Quaternion } from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

const Laser = ({start, end}) => {
  const midpoint = start.map((n, i) => (n + end[i]) / 2);
  const distanceVecArr = end.map((n, i) => (n - start[i]));
  const distanceVec = new Vector3(distanceVecArr[0], distanceVecArr[1], distanceVecArr[2])
  const laserTexture = useAnimation("laser-animation/laser0", "png", 139, 1);  
  const positionVec = new Vector3(start[0], start[1], start[2]).addScaledVector(distanceVec, 0.54383)
  const normalized = new Vector3().copy(distanceVec).normalize()
  const q = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0), normalized);
  const rotation = new Euler().setFromQuaternion(q);
  const plane = useRef();

  useEffect(() => {
    
  }, [])

  return (
    <>
      <mesh position={positionVec} scale={distanceVec.length() * 1.7543} rotation={rotation} ref={plane}>
        <planeGeometry />
        <meshBasicMaterial map={laserTexture} transparent />
      </mesh>
      <mesh position={start} scale={.1}>
        <sphereGeometry />
        <meshBasicMaterial />
      </mesh>
      <mesh position={end} scale={.1}>
        <sphereGeometry />
        <meshBasicMaterial />
      </mesh>
    </>
  )
}

export default Laser;