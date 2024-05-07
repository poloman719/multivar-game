import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useEffect, useRef, useState } from "react";
import { Billboard, Text } from "@react-three/drei";

export const Ship = ({ position, name, addShip }) => {
  const [showText, setShowText] = useState(false);
  const texture = useLoader(TextureLoader, "rocket.png");
  const ship = useRef();

  useEffect(() => {
    if (ship.current) addShip(ship.current);
  }, [ship.current])

  useFrame((state, delta) => {
    // ship.current.translateY(delta / 5);
    ship.current.lookAt(state.camera.position);
    ship.current.rotateZ(-Math.PI / 2);
  });

  return (
    <>
      <Billboard visible={showText} position={position.map((n, i) => i == 1 ? n + .5 : n)} scale={.2}>
        <Text> {"("}{position[0]}, {position[2]}, {position[1]}{")"}</Text>
      </Billboard>
      <mesh
        position={position}
        scale={.35}
        onPointerEnter={() => setShowText(true)}
        onPointerLeave={() => setShowText(false)}
        visible={false}
      >
        <sphereGeometry />
        
      </mesh>
      <mesh
        position={position}
        scale={0.2}
        ref={ship}
        name={name}
        userData={{ health: 100}}
      >
        <planeGeometry />
        <meshBasicMaterial attach='material' map={texture} transparent />
      </mesh>
    </>
  );
};
