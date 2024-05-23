import { DoubleSide, Euler, Vector3 } from "three";
import useAnimation from "./useAnimation";
import { Quaternion } from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { TextureLoader } from "three";

const Laser = ({ start, end }) => {
  const midpoint = start.map((n, i) => (n + end[i]) / 2);
  const distanceVecArr = end.map((n, i) => n - start[i]);
  const distanceVec = new Vector3(
    distanceVecArr[0],
    distanceVecArr[1],
    distanceVecArr[2]
  );
  const [laserTexture, startLaserTexture] = useAnimation(
    "laser-animation/laser sprite0",
    "png",
    92,
    1
  );
  const positionVec = new Vector3(start[0], start[1], start[2]).addScaledVector(
    distanceVec,
    0.5
  );
  const normalized = new Vector3().copy(distanceVec).normalize();
  const q = new Quaternion().setFromUnitVectors(
    new Vector3(1, 0, 0),
    normalized
  );
  const rotation = new Euler().setFromQuaternion(q);
  const plane = useRef();
  const frame = useRef(1);

  // const animate = () => {
  //   const loader = new TextureLoader();
  //   loader.load(`${"laser-animation/laser0"}${frame.current < 10 ? "00" + frame.current : (frame.current < 100 ? "0" + frame.current : frame.current )}.${"png"}`, texture => {
  //     if (plane.current) plane.current.material.map = texture;
  //   })
  //   frame.current++;
  //   console.log(frame.current)
  //   if (frame.current < 139) setTimeout(animate, 33);
  // }

  // animate();

  // useEffect(() => {
  //   if (!plane.current) return;
  //   console.log(plane.current);
  //   // useAnimation("laser-animation/laser0", "png", 139, 1, plane.current)
  //   animate();
  // }, [plane.current])

  useEffect(() => {
    startLaserTexture();
  }, []);

  return (
    <mesh
      position={positionVec}
      scale={[distanceVec.length() * 1.7543, 5, 5]}
      rotation={rotation}
      ref={plane}
    >
      <planeGeometry />
      <meshBasicMaterial
        transparent
        ref={plane}
        map={laserTexture}
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

export default Laser;
