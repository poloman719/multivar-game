import { OrbitControls, Line } from "@react-three/drei";
import { Ship } from "./Ship";

export const Experience = ({ line, ships, addShip }) => {

  // const positions = useRef(new Array(7).fill(0).map(() => {
  //   const x = Math.floor(Math.random() * 11) - 5;
  //   const y = Math.floor(Math.random() * 11) - 5;
  //   const z = Math.floor(Math.random() * 11) - 5;
  //   return [x, y, z]
  // }));

  return (
    <>
      <OrbitControls />
      {line && <Line 
        points={[[line[0].x,line[0].y,line[0].z],[line[0].x + line[1].x * 10, line[0].y + line[1].y * 10, line[0].z + line[1].z * 10]]}
        segments
        color="red"
      />}
      {ships?.filter(ship => ship.health > 0).map(ship => <Ship key={ship.id} data={ship} addShip={addShip}/>)}
    </>
  );
};
