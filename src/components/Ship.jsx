import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, Vector3 } from "three";
import { useContext, useEffect, useRef, useState } from "react";
import { Billboard, Text } from "@react-three/drei";

export const Ship = ({ data, addShip }) => {
  const [showText, setShowText] = useState(false);
  const texture = useLoader(TextureLoader, "rocket.png");
  const ship = useRef();
  const hitBox = useRef();

  const position = new Vector3(data.position[0], data.position[1], data.position[2]);

  useEffect(() => {
    if (hitBox.current) addShip(hitBox.current);
  }, [hitBox.current]);

  useFrame((state, delta) => {
    ship.current.lookAt(state.camera.position);
    ship.current.rotateZ(-Math.PI / 2);
  });

  return (
    <group>
      <Billboard
        visible={showText}
        position={position.add(new Vector3(0, 0.5, 0))}
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
        <meshBasicMaterial attach='material' map={texture} transparent />
      </mesh>
    </group>
  );
};
