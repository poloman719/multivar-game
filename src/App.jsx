import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import SideBar from "./components/SideBar";

function App() {
  return (
    <>
      <div className="app">
        <SideBar />
        <Canvas shadows camera={{ position: [0, 0, 20], fov: 30 }}>
          <color attach='background' args={["#000000"]} />
          <Experience />
        </Canvas>
      </div>
    </>
  );
}

export default App;
