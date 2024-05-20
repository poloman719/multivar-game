import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, Vector3 } from "three";
import { useContext, useEffect, useRef, useState } from "react";
import { Billboard, Text } from "@react-three/drei";

export const Ship = ({ data, addShip, exploded }) => {
  const [showText, setShowText] = useState(false);
  const texture = useLoader(TextureLoader, "rocket.png");
  const explosionTexture = useLoader(TextureLoader, "explosion.png")
  const ship = useRef();
  const hitBox = useRef();

  const position = new Vector3(data.position[0], data.position[1], data.position[2]);

  useEffect(() => {
    if (hitBox.current) addShip(hitBox.current);
  }, [hitBox.current]);

  useEffect(() => {
    console.log(exploded)
  }, [exploded])

  useFrame((state, delta) => {
    // if (data.velocity) ship.current.position.add(new Vector3(data.velocity[0], data.velocity[1], data.velocity[2]) * delta / 1000)
    if (data.velocity) {
      // const localVelocity = ship.current.worldToLocal(new Vector3(data.velocity[0], data.velocity[1], data.velocity[2]));
      // console.log(localVelocity.length());
      // ship.current.translateOnAxis(localVelocity.normalize().negate(), localVelocity.length() * delta)
      ship.current.position.x += data.velocity[0] * delta
      ship.current.position.y += data.velocity[1] * delta
      ship.current.position.z += data.velocity[2] * delta
    }
    ship.current.lookAt(state.camera.position);
    ship.current.rotateZ(-Math.PI / 2);
  });

  return (
    <group>
      <Billboard
        visible={showText}
        position={data.position.map((n, i) => i == 1 ? n + .5 : n)}
        scale={0.2}
      >
        <Text>
          {data.name} {"("}
          {position.x}, {position.z}, {position.y}
          {")"}
        </Text>
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
      <mesh position={position} scale={0.2} ref={ship}>
        <planeGeometry />
        <meshBasicMaterial attach='material' map={exploded ? explosionTexture : texture} transparent />
      </mesh>
    </group>
  );
};
