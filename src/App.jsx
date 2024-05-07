import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useState, createContext } from "react";
import SideBar from "./components/SideBar";

export const LineContext = createContext(null);

function App() {
  const [line, setLine] = useState(null);

  return (
    <>
      <div className='app'>
        <LineContext.Provider value={line}>
          <SideBar setLine={setLine} />
          <Canvas shadows camera={{ position: [0, 0, 20], fov: 30 }}>
            <color attach='background' args={["#000000"]} />
            <Experience />
          </Canvas>
        </LineContext.Provider>
      </div>
    </>
  );
}

export default App;