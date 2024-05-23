import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useEffect, useRef, useState } from "react";

const useAnimation = (filepath, extension, frames, start) => {
  const [currFrame, setCurrFrame] = useState(start);
  const texture = useLoader(TextureLoader, `${filepath}${currFrame < 10 ? "00" + currFrame : (currFrame < 100 ? "0" + currFrame : currFrame )}.${extension}`)
  const interval = useRef()

  const startAnimation = () => {
    interval.current = setInterval(animation, 33);
  }

  const animation = () => {
    // if (currFrame == frames - 1) return;
    setCurrFrame(state => {
      if (state == frames - 1) {
        clearInterval(interval.current);
      }
      return state + 1;
    })
    // setTimeout(animation, 33)
  }

  // useEffect(() => {
  //   interval.current = setInterval(animation, 33);
  // }, []);

  return [texture, startAnimation];
}

export default useAnimation;