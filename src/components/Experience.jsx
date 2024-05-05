import { OrbitControls } from "@react-three/drei";
import { Ship } from "./Ship";

export const Experience = () => {
  
  return (
    <>
      <OrbitControls />
      {new Array(7).fill(0).map(() => {
        const x = Math.floor(Math.random() * 11) - 5;
        const y = Math.floor(Math.random() * 11) - 5;
        const z = Math.floor(Math.random() * 11) - 5;
        return <Ship position={[x, y, z]} name={"Joe"}/>
      })}
    </>
  );
};
