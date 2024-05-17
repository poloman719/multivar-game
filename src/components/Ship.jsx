import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useContext, useEffect, useRef, useState } from "react";
import { Billboard, Text } from "@react-three/drei";
import { UserContext } from "../App";

export const Ship = ({ data, addShip }) => {
  const user = useContext(UserContext);
  const [showText, setShowText] = useState(false);
  const texture = useLoader(TextureLoader, "rocket.png");
  const ship = useRef();
  const hitBox = useRef();

  const position = data.position;

  useEffect(() => {
    if (hitBox.current) addShip(hitBox.current);
  }, [hitBox.current]);

  useFrame((state, delta) => {
    if (user == data.name) {
      ship.current.translateY(delta / 5);
    }
    ship.current.lookAt(state.camera.position);
    ship.current.rotateZ(-Math.PI / 2);
  });

  return (
    <group>
      <Billboard
        visible={showText}
        position={position.map((n, i) => (i == 1 ? n + 0.5 : n))}
        scale={0.2}
      >
        <Text>
          {data.name} {"("}
          {position[0]}, {position[2]}, {position[1]}
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
        userData={{ id: data.id}}
      >
        <sphereGeometry />
        <meshBasicMaterial transparent />
      </mesh>
      <mesh
        position={position}
        scale={0.2}
        ref={ship}
      >
        <planeGeometry />
        <meshBasicMaterial attach='material' map={texture} transparent />
      </mesh>
    </group>
  );
};
