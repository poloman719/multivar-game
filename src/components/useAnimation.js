import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useEffect, useRef, useState } from "react";

let frame = 1;

const useAnimation = (filepath, extension, frames, start) => {
  const [currFrame, setCurrFrame] = useState(1);
  const [state, setState] = useState(false);
  const texture = useLoader(TextureLoader, `${filepath}${frame < 10 ? "00" + frame : (frame < 100 ? "0" + frame : frame )}.${extension}`)
  const interval = useRef()

  const animation = () => {
    console.log(frame);
    frame++;
    setState(state => !state)
    if (frame < frames) setTimeout(animation, 33)
  }

  // const animation = () => {
  //   // if (currFrame == frames - 1) return;
  //   setCurrFrame(state => {
  //     // console.log(state)
  //     console.log(currFrame);
  //     if (state >= frames - 1) {
  //       clearInterval(interval.current);
  //       return state;
  //     }
  //     return state + 1;
  //   })
  //   // setTimeout(animation, 33)
  // }



  useEffect(() => {
    animation();
    // interval.current = setInterval(animation, 33);
  }, []);

  return texture;
}

export default useAnimation;