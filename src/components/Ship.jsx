import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, Vector3 } from "three";
import { useEffect, useRef, useState } from "react";
import { Billboard, Text } from "@react-three/drei";
import useAnimation from "./useAnimation";
import { DoubleSide } from "three";
import { Quaternion } from "three";

export const Ship = ({ data, addShip, exploded, isYou }) => {
  const [showText, setShowText] = useState(false);
  const texture = useLoader(TextureLoader, "rocket.png");
  const indicatorTexture = useLoader(TextureLoader, "you-indicator.png");
  const explosionTexture = useLoader(TextureLoader, "explosion.png");
  const [animExplosionTexture, startAnimExplosionTexture] = useAnimation(
    "explosion-animation/explosion0",
    "png",
    67,
    1
  );

  const ship = useRef();
  const hitBox = useRef();
  const board = useRef();

  const position = new Vector3(
    data.position[0],
    data.position[1],
    data.position[2]
  );

  useEffect(() => {
    if (hitBox.current) addShip(hitBox.current);
  }, [hitBox.current]);

  useEffect(() => {
    console.log(exploded);
    if (exploded) startAnimExplosionTexture();
  }, [exploded]);

  useFrame((state, delta) => {
    // if (data.velocity) ship.current.position.add(new Vector3(data.velocity[0], data.velocity[1], data.velocity[2]) * delta / 1000)
    if (data.velocity) {
      // const localVelocity = ship.current.worldToLocal(new Vector3(data.velocity[0], data.velocity[1], data.velocity[2]));
      // console.log(localVelocity.length());
      // ship.current.translateOnAxis(localVelocity.normalize().negate(), localVelocity.length() * delta)
      ship.current.position.x += data.velocity[0] * delta;
      ship.current.position.y += data.velocity[1] * delta;
      ship.current.position.z += data.velocity[2] * delta;
      hitBox.current.position.x += data.velocity[0] * delta;
      hitBox.current.position.y += data.velocity[1] * delta;
      hitBox.current.position.z += data.velocity[2] * delta;
      board.current.position.x += data.velocity[0] * delta;
      board.current.position.y += data.velocity[1] * delta;
      board.current.position.z += data.velocity[2] * delta;
      const normalized = new Vector3(data.velocity[0], data.velocity[1], data.velocity[2]).normalize();
      const q = new Quaternion().setFromUnitVectors(
        new Vector3(1, 0, 0),
        normalized
      );
      ship.current.rotation.setFromQuaternion(q);
      hitBox.current.rotation.setFromQuaternion(q);
      board.current.rotation.setFromQuaternion(q);
    }
    // ship.current.lookAt(state.camera.position);
    // ship.current.rotateZ(Math.PI / 2)
  });

  return (
    <group>
      <Billboard
        position={data.position.map((n, i) => (i == 1 ? n + 0.5 : n))}
        scale={0.2}
        ref={board}
      >
        <Text visible={showText}>
          {"("}
          {position.x}, {position.z}, {position.y}
          {")"}
        </Text>
        {!isYou && <Text visible={!showText}>{data.name}</Text>}
        {isYou && (
          <mesh visible={!showText} scale={2}>
            <planeGeometry />
            <meshBasicMaterial map={indicatorTexture} />
          </mesh>
        )}
      </Billboard>
      <mesh
        position={position}
        scale={0.35}
        onPointerEnter={() => setShowText(true)}
        onPointerLeave={() => setShowText(false)}
        visible={false}
        ref={hitBox}
        userData={{ id: data.id }}
      >
        <sphereGeometry />
        <meshBasicMaterial transparent />
      </mesh>
      <mesh
        position={position}
        scale={[1.51830443 * 0.5, 1 * 0.5, 1 * 0.5]}
        ref={ship}
      >
        <planeGeometry />
        <meshBasicMaterial
          attach='material'
          map={exploded ? animExplosionTexture : texture}
          transparent
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
